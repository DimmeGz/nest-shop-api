import { IsEmail, IsString, MinLength, IsPhoneNumber, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateSupplierDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string

  @IsOptional()
  @IsPhoneNumber('UA')
  readonly phone: string

  @IsOptional()
  @IsEmail()
  readonly email: string
}