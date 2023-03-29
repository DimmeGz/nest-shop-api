import {IsNotEmpty, IsEmail, IsString, MinLength, IsPhoneNumber} from 'class-validator'

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
  readonly phone: string

  @IsNotEmpty()
  @IsEmail()
  readonly email: string
}