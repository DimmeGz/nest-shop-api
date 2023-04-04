import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalSupplierAuthGuard extends AuthGuard('supplier') {}