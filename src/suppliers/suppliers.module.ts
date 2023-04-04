import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { UserExistsRule } from "../middleware/unique.validator";
import { Supplier } from "./supplier.entity";
import { SuppliersController } from "./suppliers.controller";
import { SuppliersService } from "./suppliers.service";

@Module({
  providers: [
    SuppliersService,
    // UserExistsRule,
    ],
  controllers: [SuppliersController],
  imports: [TypeOrmModule.forFeature([Supplier])],
  exports: [SuppliersService],
})
export class SuppliersModule {
}