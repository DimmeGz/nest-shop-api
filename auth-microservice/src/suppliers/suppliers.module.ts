import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { Supplier } from "./supplier.entity";
import { SuppliersService } from "./suppliers.service";

@Module({
  providers: [
    SuppliersService,
    ],
  controllers: [],
  imports: [TypeOrmModule.forFeature([Supplier])],
  exports: [SuppliersService],
})
export class SuppliersModule {
}