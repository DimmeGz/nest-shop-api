import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./product.entity";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";

import { User } from "../users/entities/user.entity";
import { OrderRow } from "../orders/entities/order-row.entity";

import { CategoriesModule } from "../categories/categories.module";
import { CommentsModule } from "../comments/comments.module";
import { ImagesModule } from "../images/images.module";
import { RatingsModule } from "../ratings/ratings.module";

@Module({
  providers: [
    ProductsService,
  ],
  controllers: [
    ProductsController,
  ],
  imports: [
    CategoriesModule,
    CommentsModule,
    ImagesModule,
    RatingsModule,
    TypeOrmModule
    .forFeature([
      Product,
      User,
      OrderRow
    ])],
  exports: [ProductsService]
})
export class ProductsModule {
}