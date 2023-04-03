import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./product.entity";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";

import { CategoriesModule } from "../categories/categories.module";

@Module({
  providers: [
    ProductsService,
  ],
  controllers: [
    ProductsController,
  ],
  imports: [
    TypeOrmModule
    .forFeature([Product])],
  exports: [ProductsService]
})
export class ProductsModule {
}