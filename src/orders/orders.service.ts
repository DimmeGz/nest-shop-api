import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepository: Repository<Order>) {
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
      return await this.ordersRepository.findOneOrFail({where: { id }, relations: ['user'] });
    } catch (e) {
      return e;
    }
  }

  async create(req, createOrderDto: CreateOrderDto) {
    try {
      const {status} = createOrderDto

      const newOrder: Order = this.ordersRepository.create({ status, user: {id: req.user.userId} });
      await Order.save(newOrder);

      return newOrder;

    } catch (e) {
      return e;
    }
  }

  async update(req, id: number, updateOrderDto: UpdateOrderDto) {
    try {
      if (req.user.role === 'admin') {
        await this.ordersRepository.update({ id }, updateOrderDto);
        return await this.ordersRepository.findOneOrFail({where: { id }, relations: ['user'] });
      };
      const order = await this.ordersRepository.findOneOrFail({where: { id, user: { id: req.user.userId } }, relations: ['user'] });
      Object.assign(order, updateOrderDto)
      await order.save()
      return order
    } catch (e) {
      return e;
    }
  }

  async remove(req, id: number) {
    try {
      let result
      if (req.user.role === 'admin') {
        result = await this.ordersRepository.delete(id);
      } else {
        result = await this.ordersRepository.delete({ id, user: { id: req.user.userId } });
      }
      return result;
    } catch (e) {
      return e;
    }
  }
}