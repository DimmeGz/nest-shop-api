import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { SuppliersService } from '../suppliers/suppliers.service';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly suppliersService: SuppliersService,
    private jwtService: JwtService
  ) { }

  async login(data, userType) {
    try {
      let user
      if (userType === 'supplier') {
        user = await this.suppliersService.findByAuthField(data.authField)
      } else if (userType === 'user') {
        user = await this.usersService.findByAuthField(data.authField)
      }
      if (user) {
        const validate = await bcrypt.compare(data.password, user.password);

        if (validate) {
          const payload = { id: user.id, role: user.role };
          return {
            access_token: this.jwtService.sign(payload),
          };
        }
      }
      throw new RpcException('Wrong access token');
    } catch (e) {
      throw e
    }
  }
}
