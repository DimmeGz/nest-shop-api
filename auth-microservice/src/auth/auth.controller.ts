import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';


@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @EventPattern('user-login')
  async userLogin(data) {
    try {
      return await this.authService.userLogin(data)
    } catch (e) {
      return e
    }
  }
}
