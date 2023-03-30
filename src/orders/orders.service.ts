import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderRow } from "./entities/order-row.entity";
import { Product } from "../products/entities/product.entity";

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>,
              @InjectRepository(OrderRow) private orderRowRepository: Repository<OrderRow>,
              @InjectRepository(Product) private productRepository: Repository<Product>) {
  }
  async findAll(): Promise<Order[]> {
    try {
      return await this.ordersRepository.find();
    } catch (e) {
      return e;
    }
  }

  async findOne(id: number): Promise<Order> {
    try {
      return await this.ordersRepository.findOneOrFail({where: { id }, relations: ['user', 'orderRows', 'orderRows.product'] });
    } catch (e) {
      return e;
    }
  }

  async create(req, createOrderDto: CreateOrderDto) {
    try {
      const {status} = createOrderDto
      const newOrder: Order = this.ordersRepository.create({ status, user: {id: req.user.userId} });
      await Order.save(newOrder);

      if (Array.isArray(createOrderDto.orderRows)) {
        for await (let row of createOrderDto.orderRows) {
          const {qty, product} = row
          const newRow: OrderRow = this.orderRowRepository.create({ qty, product: {id:product}, order: {id: newOrder.id} });
          await newRow.save()
          const productInstance = await this.productRepository.findOneOrFail({where: { id: newRow.product.id } });
          newOrder.sum += qty * productInstance.price
        }
      }
      await Order.save(newOrder);

      return newOrder;
    } catch (e) {
      return e;
    }
  }

  async update(req, id: number, updateOrderDto: UpdateOrderDto) {
    try {
      let order
      if (req.user.role === 'admin') {
        order = await this.ordersRepository
          .findOneOrFail({where: { id }, relations: ['user', 'orderRows', 'orderRows.product'] });
      } else {
        order = await this.ordersRepository
          .findOneOrFail({where: { id, user: { id: req.user.userId } }, relations: ['user', 'orderRows', 'orderRows.product'] });
      }
      if (!updateOrderDto.orderRows) {
        Object.assign(order, updateOrderDto)
      } else {
        // delete old rows
        const orderRows = await this.orderRowRepository.find({where: { order: { id: id } }});
        for await (let row of orderRows) {
          await OrderRow.remove(row)
        }
        order.sum = 0
        order.orderRows = []

        // create new rows
        if (Array.isArray(updateOrderDto.orderRows)) {
          for await (let row of updateOrderDto.orderRows) {
            const {qty, product} = row
            const newRow: OrderRow = this.orderRowRepository.create({ qty, product: {id:product}, order: {id: id} });
            await newRow.save()
            order.orderRows.push(newRow)
            const productInstance = await this.productRepository.findOneOrFail({where: { id: newRow.product.id } });
            order.sum += qty * productInstance.price
          }
        }
      }
      await order.save()
      return order
    } catch (e) {
      return e;
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

      const orderRows = await this.orderRowRepository.find({where: { order: { id: order.id } }});

      for await (let row of orderRows) {
        await OrderRow.remove(row)
      }

      await Order.remove(order)

      return { deleted: id };
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}