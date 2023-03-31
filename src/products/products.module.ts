import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./entities/product.entity";
import { ProductsService } from "./services/products.service";
import { ProductsController } from "./controllers/products.controller";

import { User } from "../users/entities/user.entity";
import { Category } from "../categories/category.entity";
import { Comment } from "../comments/comment.entity";
import { Image } from "../images/image.entity";

import { RatingsService } from "../ratings/ratings.service";
import { RatingsController } from "../ratings/ratings.controller";
import { Rating } from "../ratings/rating.entity";
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