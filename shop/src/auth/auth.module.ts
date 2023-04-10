import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from "./auth.controller";
import { RabbitMQModule } from '../rabbit-mq/rabbit-mq.module';
import { JwtModule } from "@nestjs/jwt";
import { config } from 'dotenv';
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SuppliersModule } from '../suppliers/suppliers.module';
config();

@Module({
  imports: [
    RabbitMQModule,
    UsersModule,
    SuppliersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2 days' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
