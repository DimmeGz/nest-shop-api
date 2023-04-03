import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Order } from "./order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderRowService } from "../order-rows/order-row.service";

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>,
              private readonly orderRowService: OrderRowService) {
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

  async create(req, createOrderDto: CreateOrderDto) {
    try {
      const {status, orderRows } = createOrderDto
      await this.orderRowService.checkProductsAvailability(orderRows)

      const newOrder: Order = await this.ordersRepository.save({ status, user: {id: req.user.userId} });

      newOrder.sum = await this.orderRowService.createOrderRowsAndCountSum(orderRows, newOrder.id, newOrder.status)
      return Order.save(newOrder);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(req, id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.findOne(req, id)
      if (!updateOrderDto.orderRows) {
        if (order.status !== updateOrderDto.status && [updateOrderDto.status, order.status].includes('completed')) {
          await this.orderRowService.updateProductBuyerCount(order.id, order.status, updateOrderDto.status)
        }
        Object.assign(order, updateOrderDto)

      } else {
        await this.orderRowService.checkUpdateAvailability (id, updateOrderDto.orderRows)
        await this.orderRowService.deleteRows (id, order.status)
        order.sum = await this.orderRowService.createOrderRowsAndCountSum (updateOrderDto.orderRows, id, order.status)
      }

      return await Order.save(order)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(req, id: number) {
    try {
      const order = await this.ordersRepository.findOneOrFail({ where: { id, user: { id: req.user.userId } } });

      await this.orderRowService.deleteRows(order.id, order.status)
      await Order.remove(order)
      return { deleted: id };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}