import { Module, ValidationPipe } from "@nestjs/common";

import {TypeOrmModule} from '@nestjs/typeorm';
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { APP_PIPE } from "@nestjs/core";

@Module({
  providers: [UsersService,     {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  },],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {}