import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Body
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";



@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {
  }

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id)
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id)
  }

  @Patch(':id')
  update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: number): Promise<User> {
    return this.userService.update(id, updateUserDto)
  }

}
