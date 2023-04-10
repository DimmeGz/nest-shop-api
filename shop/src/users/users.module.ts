import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { UserExistsRule } from "../middleware/unique.validator";
import { config } from 'dotenv';
import { RabbitMQModule } from "../rabbit-mq/rabbit-mq.module";
config();

@Module({
  providers: [
    UsersService,
    UserExistsRule,
    ],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([User]), 
    RabbitMQModule,
  ],
  exports: [UsersService],
})
export class UsersModule {
}