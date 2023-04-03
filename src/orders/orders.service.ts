import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Order } from "./order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderRow } from "../order-rows/order-row.entity";
import { Product } from "../products/product.entity";
import { OrderRowService } from "../order-rows/order-row.service";

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>,
              @InjectRepository(OrderRow) private orderRowRepository: Repository<OrderRow>,
              @InjectRepository(Product) private productRepository: Repository<Product>,
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
      let order
      if (req.user.role === 'admin') {
        order = await this.ordersRepository.findOneOrFail({ where: { id } });
      } else {
        order = await this.ordersRepository.findOneOrFail({ where: { id, user: { id: req.user.userId } } });
      }

      await this.orderRowService.deleteRows(order.id, order.status)
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