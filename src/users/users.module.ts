import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { UserExistsRule } from "../middleware/unique.validator";
import { config } from 'dotenv';
config();

@Module({
  providers: [
    UsersService,
    UserExistsRule,
    ],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2 days' },
  })],
  exports: [UsersService],
})
export class UsersModule {
}