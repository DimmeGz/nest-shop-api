import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RatingsService } from "./ratings.service";
import { RatingsController } from "./ratings.controller";
import { Rating } from "./rating.entity";
import { ProductsModule } from "../products/products.module";

@Module({
  providers: [RatingsService],
  controllers: [RatingsController],
  imports: [TypeOrmModule.forFeature([Rating]), ProductsModule],
  exports: [RatingsService],
})
export class RatingsModule {
}