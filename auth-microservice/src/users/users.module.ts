import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

@Module({
  providers: [
    UsersService,
    ],
  controllers: [],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
})
export class UsersModule {
}