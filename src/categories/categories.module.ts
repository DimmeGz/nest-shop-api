import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { Category } from "./category.entity";
import { Product } from "../products/product.entity";

@Module({
  providers: [
    CategoriesService,
  ],
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([Category, Product])],
  exports: [CategoriesService],
})
export class CategoriesModule {
}