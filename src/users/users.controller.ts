import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "../auth/roles/roles.decorator";
import { Role } from "../auth/roles/roles.enum";


@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }

  @Get()
  @Roles(Role.Admin)
  getAll(@Request() req): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  @Roles(Role.Admin, Role.Owner)
  getOne(@Request() req, @Param("id") id: number): Promise<User> {
      return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Roles(Role.Admin)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.userService.remove(id);
  }

  @Roles(Role.Admin, Role.Owner)
  @Patch(":id")
  update(@Body() updateUserDto: UpdateUserDto, @Param("id") id: number): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }
}
