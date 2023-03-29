import { Module, ValidationPipe } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { APP_PIPE } from "@nestjs/core";
import { UserExistsRule } from "../middleware/unique.validator";

@Module({
  providers: [
    UsersService,
    UserExistsRule,
    // {
    //   provide: APP_PIPE,
    //   useValue: new ValidationPipe({
    //     whitelist: true,
    //     forbidNonWhitelisted: true,
    //     transform: true
    //   }),
    // }
    ],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {
}