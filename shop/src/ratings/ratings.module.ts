import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RatingsService } from "./ratings.service";
import { RatingsController } from "./ratings.controller";
import { Rating } from "./rating.entity";
import { ProductsModule } from "../products/products.module";
import { RabbitMQModule } from "../rabbit-mq/rabbit-mq.module";

@Module({
  providers: [RatingsService],
  controllers: [RatingsController],
  imports: [
    TypeOrmModule.forFeature([Rating]), 
    ProductsModule, 
    RabbitMQModule
  ],
  exports: [RatingsService],
})
export class RatingsModule {
}