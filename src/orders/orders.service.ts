import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderRow } from "./entities/order-row.entity";
import { Product } from "../products/entities/product.entity";
import { rootLogger } from "ts-jest";

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>,
              @InjectRepository(OrderRow) private orderRowRepository: Repository<OrderRow>,
              @InjectRepository(Product) private productRepository: Repository<Product>) {
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
      let order
      if (req.user.role === 'admin') {
        order = await this.ordersRepository.findOneOrFail({where: { id }, relations: ['user', 'orderRows', 'orderRows.product'] });
      } else {
        order = await this.ordersRepository
          .findOneOrFail({where: { id, user: { id: req.user.userId } }, relations: ['user', 'orderRows', 'orderRows.product'] });
      };
      return order;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(req, createOrderDto: CreateOrderDto) {
    try {
      const {status, orderRows } = createOrderDto
      if (Array.isArray(orderRows)) {
        const canCreate = await this.checkProductsAvailability(createOrderDto)
        if (!canCreate.canCreate){
          throw new HttpException(canCreate.message, HttpStatus.NOT_ACCEPTABLE);
        }
      }
      const newOrder: Order = this.ordersRepository.create({ status, user: {id: req.user.userId} });
      await Order.save(newOrder);

      if (Array.isArray(orderRows)) {
        await this.createOrderRows (orderRows, newOrder)
      }
      return Order.save(newOrder);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(req, id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.findOne(req, id)
      if (!updateOrderDto.orderRows) {
        // update product.buyersCount
        if (order.status !== updateOrderDto.status && [updateOrderDto.status, order.status].includes('completed')) {
          const orderRows = await this.orderRowRepository.find({where: { order: { id: id } }, relations: ['product']});
          for await (let row of orderRows) {
            const productInstance = await this.productRepository.findOneOrFail({where: { id: row.product.id } });
            if (order.status === 'completed') {
              productInstance.buyersCount -= 1
              await Product.save(productInstance)
            }
            if (updateOrderDto.status === 'completed') {
              productInstance.buyersCount += 1
              await Product.save(productInstance)
            }
          }
        }
        Object.assign(order, updateOrderDto)

      } else {
        // delete old rows
        const orderRows = await this.orderRowRepository.find({where: { order: { id: id } }, relations: ['product']});
        await this.removeProductsFromRows(order, orderRows)
        order.sum = 0
        order.orderRows = []

        // create new rows
        if (Array.isArray(updateOrderDto.orderRows)) {
          const canCreate = await this.checkProductsAvailability(updateOrderDto)
          if (!canCreate.canCreate){
            // if can't save new orderRows, return to old orderRows
            await this.createOrderRows (orderRows, order)
            throw new HttpException(canCreate.message, HttpStatus.NOT_ACCEPTABLE);
          }

          for await (let row of updateOrderDto.orderRows) {
            const {qty, product} = row
            const newRow: OrderRow = this.orderRowRepository.create({ qty, product: {id:product}, order: {id: id} });
            await OrderRow.save(newRow)
            order.orderRows.push(newRow)
            const productInstance = await this.productRepository.findOneOrFail({where: { id: newRow.product.id } });
            order.sum += qty * productInstance.price
            // update product.buyersCount
            if (order.status === 'completed') {
              productInstance.buyersCount += 1
            }
            productInstance.count -= row.qty
            if (productInstance.count === 0) {
              productInstance.isAvailable = false
            }
          }
          for await (let row of updateOrderDto.orderRows) {
            const productInstance = await this.productRepository.findOneOrFail({ where: { id: row.product.id } });
            await Product.save(productInstance)
          }
        }
      }
      await Order.save(order)
      return order
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(req, id: number) {
    try {
      let order
      if (req.user.role === 'admin') {
        order = await this.ordersRepository.findOneOrFail({ where: { id } });
      } else {
        order = await this.ordersRepository.findOneOrFail({ where: { id, user: { id: req.user.userId } } });
      }

      const orderRows = await this.orderRowRepository.find({where: { order: { id: order.id } }, relations: ['product']});

      await this.removeProductsFromRows(order, orderRows)

      await Order.remove(order)

      return { deleted: id };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createOrderRows (rows, newOrder) {
    for await (let row of rows) {
      const {qty} = row
      let {product} = row
      if (product.id) {
        product = product.id
      }

      const newRow: OrderRow = this.orderRowRepository.create({ qty, product: {id:product}, order: {id: newOrder.id} });
      await OrderRow.save(newRow)
      const productInstance = await this.productRepository.findOneOrFail({where: { id: newRow.product.id } });
      newOrder.sum += qty * productInstance.price
      // update product.buyersCount
      if (newOrder.status === 'completed') {
        productInstance.buyersCount += 1
      }
      productInstance.count -= qty
      if (productInstance.count === 0) {
        productInstance.isAvailable = false
      }
      await Product.save(productInstance)
    }
  }

  async removeProductsFromRows(order, orderRows) {
    for await (let row of orderRows) {
      // update product.buyersCount
      const productInstance = await this.productRepository.findOneOrFail({where: { id: row.product.id } });
      if (order.status === 'completed') {
        productInstance.buyersCount -= 1
      }
      if (productInstance.count === 0) {
        productInstance.isAvailable = true
      }
      productInstance.count += row.qty
      await Product.save(productInstance)
      await OrderRow.remove(row)
    }
  }

  async checkProductsAvailability (orderDto): Promise<any> {
    for await (let row of orderDto.orderRows) {
      const productInstance = await this.productRepository.findOneOrFail({ where: { id: row.product } });
      if (!productInstance.isAvailable) {
        return {canCreate: false, message: `Product ${productInstance.name} is not available`}
      }
      if (productInstance.count < row.qty) {
        return {canCreate: false, message: `Not enough product ${productInstance.name} on warehouse`}
      }
      return {canCreate: true}
    }
  }
}