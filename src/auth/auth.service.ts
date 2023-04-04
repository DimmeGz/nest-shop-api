import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { SuppliersService } from "../suppliers/suppliers.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { CreateSupplierDto } from "../suppliers/dto/create-supplier.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private suppliersService: SuppliersService,
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

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto)

    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload)

    return token
  }

  async login(user: any) {
    const payload = { id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async supplierRegister(createUserDto: CreateSupplierDto) {
    const user = await this.suppliersService.create(createUserDto)

    const payload = { id: user.id, role: 'supplier' };
    const token = this.jwtService.sign(payload)

    return token
  }

  async validateSupplier(username: string, pass: string): Promise<any> {
    const user = await this.suppliersService.findByName(username);

    if (user) {
      const validate = await bcrypt.compare(pass, user.password);

      if (validate) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async supplierLogin(user: any) {
    const payload = { id: user.id, role: 'supplier' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
