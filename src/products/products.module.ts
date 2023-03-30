import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./entities/product.entity";
import { ProductsService } from "./services/products.service";
import { ProductsController } from "./controllers/products.controller";
import { Category } from "./entities/category.entity";
import { CategoriesService } from "./services/categories.service";
import { CategoriesController } from "./controllers/categories.controller";

@Module({
  providers: [
    ProductsService,
    CategoriesService
  ],
  controllers: [
    ProductsController,
    CategoriesController
  ],
  imports: [TypeOrmModule.forFeature([Product, Category])],
  exports: [ProductsService]
})
export class ProductsModule {
}