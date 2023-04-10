import { BadRequestException, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';



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

  @EventPattern('get-user')
  async validate(token) {
    const userData = jwt.decode(token)
    if (userData) {
      return userData
    }
    throw new BadRequestException('Wrong access token')
  }
}
