import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalSupplierStrategy extends PassportStrategy(Strategy, 'supplier') {
  constructor(private authService: AuthService) {
    super({ usernameField: "authField" });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateSupplier(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
