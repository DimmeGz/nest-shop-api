import { Body, Controller, Delete, Get, Param, Patch, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/roles.enum";
import { IsAuthorized } from "../auth/guards/is-authorized.guard";


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
  @UseGuards(IsAuthorized)
  getOne(@Request() req, @Param("id") id: number): Promise<User> {
      return this.userService.findOne(req, id);
  }

  @Roles(Role.Admin)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.userService.remove(id);
  }

  @Roles(Role.Admin, Role.User)
  @UseGuards(IsAuthorized)
  @Patch(":id")
  update(@Body() updateUserDto: UpdateUserDto, @Param("id") id: number): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }
}
