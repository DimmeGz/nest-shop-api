import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { Order } from "./entities/order.entity";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";

@Module({
  providers: [
    OrdersService,
  ],
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([Order])],
  exports: [OrdersService],
})
export class OrdersModule {
}