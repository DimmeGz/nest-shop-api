import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';


@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

@EventPattern('login')
  async login(req) {
    try {
      return await this.authService.login(req.data, req.type)
    } catch (e) {
      return e
    }
  }
}
