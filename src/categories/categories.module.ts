import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CategoriesService } from "./categories.service";
import { CategoriesController } from "./categories.controller";
import { Category } from "./category.entity";
import { ProductsModule } from "src/products/products.module";

@Module({
  providers: [
    CategoriesService
  ],
  controllers: [CategoriesController],
  imports: [TypeOrmModule.forFeature([Category]), ProductsModule],
  exports: [CategoriesService],
})
export class CategoriesModule {
}