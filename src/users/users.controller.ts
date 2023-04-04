import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/roles.enum";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";


@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }

  @Get()
  @Roles(Role.Admin)
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  getOne(@Request() req, @Param("id") id: number): Promise<User> {
      return this.userService.findOne(req, id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<string> {
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
