import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./entities/product.entity";
import { ProductsService } from "./services/products.service";
import { ProductsController } from "./controllers/products.controller";

import { User } from "../users/entities/user.entity";
import { Category } from "../categories/category.entity";
import { Comment } from "../comments/comment.entity";
import { Image } from "../images/image.entity";

import { RatingsService } from "./services/ratings.service";
import { RatingsController } from "./controllers/ratings.controller";
import { Rating } from "./entities/rating.entity";
import { OrderRow } from "../orders/entities/order-row.entity";

import { CategoriesModule } from "../categories/categories.module";
import { CommentsModule } from "../comments/comments.module";
import { ImagesModule } from "../images/images.module";

@Module({
  providers: [
    ProductsService,
    RatingsService,
  ],
  controllers: [
    ProductsController,
    RatingsController,
  ],
  imports: [
    CategoriesModule,
    CommentsModule,
    ImagesModule,
    TypeOrmModule
    .forFeature([
      Product,
      Category,
      Comment,
      User,
      Image,
      Rating,
      OrderRow
    ])],
  exports: [ProductsService]
})
export class ProductsModule {
}