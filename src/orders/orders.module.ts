import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Order } from "./entities/order.entity";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { OrderRow } from "./entities/order-row.entity";
import { Product } from "../products/entities/product.entity";

@Module({
  providers: [
    OrdersService,
  ],
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([Order, OrderRow, Product])],
  exports: [OrdersService],
})
export class OrdersModule {
}