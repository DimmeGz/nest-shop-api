import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from "./auth.controller";
import { RabbitMQModule } from '../rabbit-mq/rabbit-mq.module';
import { config } from 'dotenv';
import { SuppliersModule } from '../suppliers/suppliers.module';
config();

@Module({
  imports: [
    RabbitMQModule,
    UsersModule,
    SuppliersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
