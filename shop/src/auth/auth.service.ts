import { Inject, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { SuppliersService } from "../suppliers/suppliers.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { CreateSupplierDto } from "../suppliers/dto/create-supplier.dto";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly client: ClientProxy,
    private usersService: UsersService,
    private suppliersService: SuppliersService,
  ) {
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto)

    const payload = { id: user.id, role: user.role };
    return await this.client.send('sign-in', payload).toPromise();
  }

  async supplierRegister(createUserDto: CreateSupplierDto) {
    const user = await this.suppliersService.create(createUserDto)

    const payload = { id: user.id, role: 'supplier' };
    return await this.client.send('sign-in', payload).toPromise();
  }
}
