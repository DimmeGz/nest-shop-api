import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RatingsService } from "./ratings.service";
import { RatingsController } from "./ratings.controller";
import { Rating } from "./rating.entity";
import { User } from "../users/entities/user.entity";
import { Product } from "../products/product.entity";

@Module({
  providers: [RatingsService],
  controllers: [RatingsController],
  imports: [TypeOrmModule.forFeature([Rating, User, Product])],
  exports: [RatingsService, TypeOrmModule],
})
export class RatingsModule {
}