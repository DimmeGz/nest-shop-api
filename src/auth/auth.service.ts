import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByName(username);

    if (user) {
      const validate = await bcrypt.compare(pass, user.password)

      if (validate) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }
}
