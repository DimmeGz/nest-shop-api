import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./entities/product.entity";
import { ProductsService } from "./services/products.service";
import { ProductsController } from "./controllers/products.controller";

import { User } from "../users/entities/user.entity";
import { Category } from "../categories/category.entity";
import { Comment } from "../comments/comment.entity";

import { Image } from "./entities/image.entity";
import { ImagesService } from "./services/images.service";
import { ImagesController } from "./controllers/images.controller";
import { RatingsService } from "./services/ratings.service";
import { RatingsController } from "./controllers/ratings.controller";
import { Rating } from "./entities/rating.entity";
import { OrderRow } from "../orders/entities/order-row.entity";

import { CategoriesModule } from "../categories/categories.module";
import { CommentsModule } from "../comments/comments.module";

@Module({
  providers: [
    ProductsService,
    ImagesService,
    RatingsService,
  ],
  controllers: [
    ProductsController,
    ImagesController,
    RatingsController,
  ],
  imports: [
    CategoriesModule,
    CommentsModule,
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