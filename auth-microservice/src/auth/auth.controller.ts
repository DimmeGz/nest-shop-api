import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcryptjs";
import { AuthService } from './auth.service';


@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) { }

  @EventPattern('login')
  async userLogin(data) {
    try {
      return await this.authService.login(data)
    } catch (e) {
      return e
    }
  }
}
