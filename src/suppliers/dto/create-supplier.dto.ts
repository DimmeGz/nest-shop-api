import { IsNotEmpty, IsEmail, IsString, MinLength, IsPhoneNumber, Validate } from "class-validator";
import { SupplierExistsRule } from "../../middleware/unique.validator";

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly name: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string

  @IsNotEmpty()
  @IsPhoneNumber('UA')
  @Validate(SupplierExistsRule)
  readonly phone: string

  @IsNotEmpty()
  @IsEmail()
  @Validate(SupplierExistsRule)
  readonly email: string
}