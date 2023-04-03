import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Order } from "./order.entity";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { OrderRowModule } from "../order-rows/order-row.module";
import { ProductsModule } from "src/products/products.module";

@Module({
  providers: [
    OrdersService,
  ],
  controllers: [OrdersController],
  imports: [
    OrderRowModule,
    ProductsModule,
    TypeOrmModule.forFeature([Order])
  ],
  exports: [OrdersService],
})
export class OrdersModule {
}