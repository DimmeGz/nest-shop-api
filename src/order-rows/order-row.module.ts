import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderRow } from "./order-row.entity";
import { OrderRowService } from "./order-row.service";
import { ProductsModule } from "src/products/products.module";

@Module({
  providers: [OrderRowService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([OrderRow]), 
    ProductsModule
  ],
  exports: [TypeOrmModule, OrderRowService],
})
export class OrderRowModule {
}