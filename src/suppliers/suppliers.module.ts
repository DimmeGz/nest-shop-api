import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { SupplierExistsRule } from "../middleware/unique.validator";
import { Supplier } from "./supplier.entity";
import { SuppliersController } from "./suppliers.controller";
import { SuppliersService } from "./suppliers.service";

import { JwtModule } from "@nestjs/jwt";
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
    JwtModule.register(
      {
        secret: process.env.JWT_SECRET, 
        signOptions: { expiresIn: '2 days' },
      }
    )
  ],
  exports: [SuppliersService],
})
export class SuppliersModule {
}