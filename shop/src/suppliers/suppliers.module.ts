import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RabbitMQModule } from "../rabbit-mq/rabbit-mq.module";
import { SupplierExistsRule } from "../middleware/unique.validator";
import { Supplier } from "./supplier.entity";
import { SuppliersController } from "./suppliers.controller";
import { SuppliersService } from "./suppliers.service";

import { config } from 'dotenv';
config();

@Module({
  providers: [
    SuppliersService,
    SupplierExistsRule,
    ],
  controllers: [SuppliersController],
  imports: [
    TypeOrmModule.forFeature([Supplier]), 
    RabbitMQModule,
  ],
  exports: [SuppliersService],
})
export class SuppliersModule {
}