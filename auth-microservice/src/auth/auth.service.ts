import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private jwtService: JwtService
  ) { }

  async userLogin(data) {
    try {
      const user = await this.usersService.findByAuthField(data.authField)
      if (user) {
        const validate = await bcrypt.compare(data.password, user.password);

        if (validate) {
          const payload = { id: user.id, role: user.role };
          return {
            access_token: this.jwtService.sign(payload),
          };
        }
      }
      throw new UnauthorizedException('Wrong login or password');
    } catch (e) {
      throw e
    }
  }
}
