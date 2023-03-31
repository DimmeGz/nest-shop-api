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
  async findAll(req): Promise<Order[]> {
    try {
      if (req.user.role === 'admin') {
        return await this.ordersRepository.find( { relations: ["user", "orderRows", "orderRows.product"] })
      } else {
        return await this.ordersRepository.find({where: {user: { id: req.user.userId }}, relations: ["user", "orderRows", "orderRows.product"]})
      }
    } catch (e) {
      return e;
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
          await OrderRow.save(newRow)
          const productInstance = await this.productRepository.findOneOrFail({where: { id: newRow.product.id } });
          newOrder.sum += qty * productInstance.price
          // update product.buyersCount
          if (newOrder.status === 'completed') {
            productInstance.buyersCount += 1
          }
          productInstance.count -= qty
          await Product.save(productInstance)
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
      const order = await this.findOne(req, id)
      if (!updateOrderDto.orderRows) {
        // update product.buyersCount
        if (updateOrderDto.status && order.status !== updateOrderDto.status && (updateOrderDto.status === 'completed' || order.status === 'completed')) {
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
        const orderRows = await this.orderRowRepository.find({where: { order: { id: id } }});
        await this.removeProductsFromRows(order, orderRows)
        order.sum = 0
        order.orderRows = []

        // create new rows
        if (Array.isArray(updateOrderDto.orderRows)) {
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
            await Product.save(productInstance)
          }
        }
      }
      await Order.save(order)
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

      await this.removeProductsFromRows(order, orderRows)

      await Order.remove(order)

      return { deleted: id };
    } catch (e) {
      return e;
    }
  }

  async removeProductsFromRows(order, orderRows) {
    for await (let row of orderRows) {
      await OrderRow.remove(row)
      // update product.buyersCount
      const productInstance = await this.productRepository.findOneOrFail({where: { id: row.product.id } });
      if (order.status === 'completed') {
        productInstance.buyersCount -= 1
      }
      productInstance.count += row.qty
      await Product.save(productInstance)
    }
  }
}