import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable, Scope, Global } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { SuppliersService } from "src/suppliers/suppliers.service";

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
@Global()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(protected readonly usersService: UsersService) {
  }

  async validate(value: any, args: ValidationArguments) {
    try {
      const checkProperty = {}
      checkProperty[args.property] = value
      const existed = await this.usersService.checkUnique(checkProperty)
      if (!existed){
        return true
      }
      return false;

    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `User with such ${args.property} already exist`;
  }
}

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
@Global()
export class SupplierExistsRule implements ValidatorConstraintInterface {
  constructor(protected readonly suppliersService: SuppliersService) {
  }

  async validate(value: any, args: ValidationArguments) {
    try {
      const checkProperty = {}
      checkProperty[args.property] = value
      const existed = await this.suppliersService.checkUnique(checkProperty)
      if (!existed){
        return true
      }
      return false;

    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `User with such ${args.property} already exist`;
  }
}