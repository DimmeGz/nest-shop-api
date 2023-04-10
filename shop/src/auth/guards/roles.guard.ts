import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Role } from "../enums/roles.enum";
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly client: ClientProxy, 
    private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]);
      if (!requiredRoles) {
        return true;
      }

      const token = context.switchToHttp().getRequest().rawHeaders[1].split(' ')[1];
      const user = await this.client.send('get-user', token).toPromise();

      if (user.role === 'admin') {
        return true
      }
      
      return requiredRoles.includes(user.role)
    } catch (e) {
      return false
    }
  }
}
