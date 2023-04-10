import { Controller, Request, Post, Body, Inject, BadRequestException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { CreateSupplierDto } from "../suppliers/dto/create-supplier.dto";
import { ClientProxy } from "@nestjs/microservices";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, 
    @Inject('AUTH_MICROSERVICE') private readonly client: ClientProxy) {}

  @Post('/login')
  async login(@Request() req): Promise<string> {
    try {
      return await this.client.send('login', {data: req.body, type: 'user'}).toPromise();
    } catch (e) {
      throw new BadRequestException(e.message)
    }
  }
  
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authService.register(createUserDto);
  }

  @Post('/supplier_login')
  async supplierLogin(@Request() req) {
    return await this.client.send('login', {data: req.body, type: 'supplier'}).toPromise();
  }

  @Post('/supplier_register')
  createSupplier(@Body() createSupplierDto: CreateSupplierDto): Promise<string> {
    return this.authService.supplierRegister(createSupplierDto);
  }
}
