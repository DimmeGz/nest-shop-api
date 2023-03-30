import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./entities/product.entity";
import { ProductsService } from "./services/products.service";
import { ProductsController } from "./controllers/products.controller";

import { User } from "../users/entities/user.entity";

import { Category } from "./entities/category.entity";
import { CategoriesService } from "./services/categories.service";
import { CategoriesController } from "./controllers/categories.controller";

import { Comment } from "./entities/comment.entity";
import { CommentsService } from "./services/comments.service";
import { CommentsController } from "./controllers/comments.controller";

import { Image } from "./entities/image.entity";
import { ImagesService } from "./services/images.service";
import { ImagesController } from "./controllers/images.controller";
import { RatingsService } from "./services/ratings.service";
import { RatingsController } from "./controllers/ratings.controller";
import { Rating } from "./entities/rating.entity";

@Module({
  providers: [
    ProductsService,
    CategoriesService,
    CommentsService,
    ImagesService,
    RatingsService,
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    CommentsController,
    ImagesController,
    RatingsController,
  ],
  imports: [TypeOrmModule
    .forFeature([
      Product,
      Category,
      Comment,
      User,
      Image,
      Rating,
    ])],
  exports: [ProductsService]
})
export class ProductsModule {
}