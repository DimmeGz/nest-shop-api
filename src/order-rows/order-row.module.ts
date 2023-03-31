import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderRow } from "./order-row.entity";

@Module({
  providers: [],
  controllers: [],
  imports: [TypeOrmModule.forFeature([OrderRow])],
  exports: [TypeOrmModule],
})
export class OrderRowModule {
}