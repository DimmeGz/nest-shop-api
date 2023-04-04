import { Controller, Request, Post, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LocalSupplierAuthGuard } from "./guards/local-supplier-auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalSupplierAuthGuard)
  @Post('/supplier_login')
  async supplierLogin(@Request() req) {
    return this.authService.supplierLogin(req.user);
  }
}
