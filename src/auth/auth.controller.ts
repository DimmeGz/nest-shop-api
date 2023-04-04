import { Controller, Request, Post, UseGuards, Body } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LocalSupplierAuthGuard } from "./guards/local-supplier-auth.guard";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { CreateSupplierDto } from "src/suppliers/dto/create-supplier.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
  
  @Post('/register')
  create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalSupplierAuthGuard)
  @Post('/supplier_login')
  async supplierLogin(@Request() req) {
    return this.authService.supplierLogin(req.user);
  }

  @Post('/supplier_register')
  createSupplier(@Body() createSupplierDto: CreateSupplierDto): Promise<string> {
    return this.authService.supplierRegister(createSupplierDto);
  }
}
