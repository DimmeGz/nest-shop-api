import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { Category } from "./category.entity";
import { Product } from "../products/product.entity";
import { ProductsService } from "src/products/products.service";

@Module({
  providers: [
    CategoriesService,
    ProductsService
  ],
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([Category, Product])],
  exports: [CategoriesService],
})
export class CategoriesModule {
}