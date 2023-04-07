import { IsNotEmpty, IsEmail, IsString, MinLength, IsPhoneNumber, Validate } from "class-validator";
import { UserExistsRule } from "../../middleware/unique.validator";

export class CreateUserDto {
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
  @Validate(UserExistsRule)
  readonly phone: string

  @IsNotEmpty()
  @IsEmail()
  @Validate(UserExistsRule)
  readonly email: string
}