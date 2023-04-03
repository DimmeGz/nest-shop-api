import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByName(username);

    if (user) {
      const validate = await bcrypt.compare(pass, user.password);

      if (validate) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
