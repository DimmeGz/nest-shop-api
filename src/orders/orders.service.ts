import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { Order } from "./order.entity";
import { Product } from "../products/product.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderRowService } from "../order-rows/order-row.service";
import { ProductsService } from "src/products/products.service";
import { OrderRow } from "src/order-rows/order-row.entity";
import { User } from "src/users/user.entity";

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>,
              private readonly orderRowService: OrderRowService,
              private readonly productsService: ProductsService, 
              private dataSource: DataSource) {
  }
  async findAll(req, query): Promise<any> {
    try {
      const take = query.take || 10
      const page = query.page || 1
      const skip = (page - 1) * query.take || 0
      let result, total
      if (req.user.role === 'admin') {
        [result, total] = await this.ordersRepository.findAndCount({
          relations: ["user", "orderRows", "orderRows.product"],
          take: take,
          skip: skip});
      } else {
        [result, total] = await this.ordersRepository.findAndCount({
          where: {user: { id: req.user.userId }},
          relations: ["user", "orderRows", "orderRows.product"],
          take: take,
          skip: skip});
      }
      return {
        page: page,
        totalPages: Math.ceil(total / take),
        elementsCount: total,
        data: result
      }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(req, id: number): Promise<Order> {
    try {
      return await this.ordersRepository
          .findOneOrFail({where: { id, user: { id: req.user.userId } }, relations: ['user', 'orderRows', 'orderRows.product'] });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  async orderSumCount(rows: OrderRow[], status: string, manager) {
    try {
      let orderSum = 0
      for await (let row of rows){
        const productInstance = await manager.findOne(Product, {where:{id: row.product.id}})
        orderSum += productInstance.price * row.qty
        await this.productsService.updateByOrderRow(status, productInstance, row.qty, manager)
      }
      return orderSum
    } catch (e) {
      throw e
    }
  }

  async create(req, createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { status, orderRows } = createOrderDto
      await this.orderRowService.checkProductsAvailability(orderRows, queryRunner.manager)

      const newOrder: Order = await queryRunner.manager.save( Order, {status, user: { id: req.user.userId } } )
      const newRows = await this.orderRowService.createOrderRows(orderRows, newOrder.id, queryRunner.manager)
      const orderSum = await this.orderSumCount(newRows, newOrder.status, queryRunner.manager)
      newOrder.sum = orderSum

      if (newOrder.status === 'completed') {
        const user = await queryRunner.manager.findOne(User, { where: { id: req.user.userId } })
        await queryRunner.manager.update(User, req.user.userId, {ballance: user.ballance - orderSum})
        await this.orderRowService.updateSuppliersBallance(newRows, newOrder.status, queryRunner.manager)
      }

      await queryRunner.manager.update(Order, newOrder.id, {sum: orderSum})
      await queryRunner.commitTransaction();

      return newOrder
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async update(req, id: number, updateOrderDto: UpdateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {where: {id}})

      if (!updateOrderDto.orderRows) {
        if (order.status !== updateOrderDto.status && [updateOrderDto.status, order.status].includes('completed')) {
          const orderRows = await this.orderRowService.getRowsByOrder (order.id, queryRunner.manager)
          await this.orderRowService.updateProductBuyerCount(orderRows, order.status, updateOrderDto.status, queryRunner.manager)  

          await this.orderRowService.updateSuppliersBallance(orderRows, updateOrderDto.status, queryRunner.manager)
          
          const user = await queryRunner.manager.findOne(User, {where: {id: req.user.userId}})
          
          if (updateOrderDto.status === 'completed') {
            await queryRunner.manager.update(User, req.user.userId, {ballance: user.ballance - order.sum})
          } else {
            await queryRunner.manager.update(User, req.user.userId, {ballance: user.ballance + order.sum})
          }
        }

        await queryRunner.manager.update(Order, order.id, updateOrderDto)
      } else {
        await this.orderRowService.checkUpdateAvailability (id, updateOrderDto.orderRows, queryRunner.manager)
        const orderRows = await this.orderRowService.getRowsByOrder (order.id, queryRunner.manager)

        if (order.status === 'completed') {
          const user = await queryRunner.manager.findOne(User, { where: { id: req.user.userId } })
          await queryRunner.manager.update(User, req.user.userId, {ballance: user.ballance + order.sum})
          await this.orderRowService.updateSuppliersBallance(orderRows, 'deleted', queryRunner.manager)
        }

        await this.orderRowService.deleteRows (orderRows, order.status, queryRunner.manager)
        const newRows = await this.orderRowService.createOrderRows(updateOrderDto.orderRows, order.id, queryRunner.manager)
        const orderSum = await this.orderSumCount(newRows, order.status, queryRunner.manager)

        if (updateOrderDto.status === 'completed') {
          const user = await queryRunner.manager.findOne(User, { where: { id: req.user.userId } })
          await queryRunner.manager.update(User, req.user.userId, {ballance: user.ballance - orderSum})
          await this.orderRowService.updateSuppliersBallance(newRows, updateOrderDto.status, queryRunner.manager)
        }

        order.sum = orderSum
        order.status = updateOrderDto.status

        await queryRunner.manager.update(Order, order.id, {sum: orderSum, status:order.status})
      }

      await queryRunner.commitTransaction();
      return order
    } catch (e) {
      console.log(e);
      
      await queryRunner.rollbackTransaction();
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(req, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, {where: {id}})

      const orderRows = await this.orderRowService.getRowsByOrder (order.id, queryRunner.manager)
      if (order.status === 'completed') {
        const user = await queryRunner.manager.findOne(User, { where: { id: req.user.userId } })
        await queryRunner.manager.update(User, req.user.userId, {ballance: user.ballance + order.sum})
        await this.orderRowService.updateSuppliersBallance(orderRows, 'deleted', queryRunner.manager)
      }

      await this.orderRowService.deleteRows(orderRows, order.status, queryRunner.manager)
      await queryRunner.manager.delete(Order, id)

      await queryRunner.commitTransaction();
      return { deleted: id };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }
}