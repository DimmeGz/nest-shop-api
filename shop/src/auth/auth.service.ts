import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
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

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto)

    const payload = { id: user.id, role: user.role };
    const token = this.jwtService.sign(payload)

    return token
  }

  async supplierRegister(createUserDto: CreateSupplierDto) {
    const user = await this.suppliersService.create(createUserDto)

    const payload = { id: user.id, role: 'supplier' };
    const token = this.jwtService.sign(payload)

    return token
  }
}
