import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from "./roles.decorator";
import { Role } from "./roles.enum";
import jwt_decode from 'jwt-decode'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const user: any = jwt_decode(context.switchToHttp().getRequest().rawHeaders[1])

    return requiredRoles.includes(user.role) || user.id === +context.switchToHttp().getRequest().params.id
  }
}
