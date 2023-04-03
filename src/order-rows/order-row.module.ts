import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderRow } from "./order-row.entity";
import { OrderRowService } from "./order-row.service";
import { Product } from "../products/product.entity";
import { ProductsModule } from "src/products/products.module";

@Module({
  providers: [OrderRowService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([OrderRow, Product]), 
    ProductsModule
  ],
  exports: [TypeOrmModule, OrderRowService],
})
export class OrderRowModule {
}