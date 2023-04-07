import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { config } from 'dotenv';
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SuppliersModule } from '../suppliers/suppliers.module';
import { LocalSupplierStrategy } from './strategies/local-supplier.strategy';
config();

@Module({
  imports: [
    UsersModule,
    SuppliersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2 days' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalSupplierStrategy, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
