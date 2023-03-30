import { Module, ValidationPipe } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { UserExistsRule } from "../middleware/unique.validator";

@Module({
  providers: [
    UsersService,
    UserExistsRule,
    ],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {
}