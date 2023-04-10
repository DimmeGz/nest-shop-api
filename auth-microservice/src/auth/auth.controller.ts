import { BadRequestException, Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';



@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
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
  async decodeToken(token) {
    const userData = this.jwtService.decode(token)
    if (userData) {
      return userData
    }
    throw new BadRequestException('Wrong access token')
  }

  @EventPattern('sign-in')
  signIn(payload) {
    return this.jwtService.sign(payload)
  }
}
