import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { config } from 'dotenv';
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SuppliersModule } from '../suppliers/suppliers.module';
config();
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_MICROSERVICE', transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ_URL],
          queue: 'user-messages',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
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
