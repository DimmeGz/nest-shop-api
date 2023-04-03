import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Order } from "./order.entity";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { Product } from "../products/product.entity";
import { OrderRowModule } from "../order-rows/order-row.module";

@Module({
  providers: [
    OrdersService,
  ],
  controllers: [OrdersController],
  imports: [
    OrderRowModule,
    TypeOrmModule.forFeature([Order])
  ],
  exports: [OrdersService],
})
export class OrdersModule {
}