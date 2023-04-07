import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrderRow } from "./order-row.entity";
import { OrderRowService } from "./order-row.service";
import { ProductsModule } from "../products/products.module";
import { SuppliersModule } from "../suppliers/suppliers.module";

@Module({
  providers: [OrderRowService],
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([OrderRow]), 
    ProductsModule,
    SuppliersModule,
  ],
  exports: [TypeOrmModule, OrderRowService],
})
export class OrderRowModule {
}