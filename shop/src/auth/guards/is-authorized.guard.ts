import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export class IsAuthorized implements CanActivate {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly client: ClientProxy
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    console.log(context);
    

    const req = context.switchToHttp().getRequest();

    try {
      const token = req.headers['authorization']?.split(' ')[1];
      const res = await this.client.send('validate', token).toPromise();
      if (res.role && res.id) {
        return true
      }
      return false
    } catch (err) {
      return false;
    }
  }
}