import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Product } from "./entities/product.entity";
import { ProductsService } from "./services/products.service";
import { ProductsController } from "./controllers/products.controller";

import { Category } from "./entities/category.entity";
import { CategoriesService } from "./services/categories.service";
import { CategoriesController } from "./controllers/categories.controller";

import { Comment } from "./entities/comment.entity";
import { CommentsService } from "./services/comments.service";
import { CommentsController } from "./controllers/comments.controller";
import { User } from "../users/entities/user.entity";

@Module({
  providers: [
    ProductsService,
    CategoriesService,
    CommentsService
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    CommentsController
  ],
  imports: [TypeOrmModule.forFeature([Product, Category, Comment, User])],
  exports: [ProductsService]
})
export class ProductsModule {
}