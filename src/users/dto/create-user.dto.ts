import {IsNotEmpty, IsEmail, IsString, MinLength, IsPhoneNumber} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  readonly name: string


  @IsString()
  @MinLength(6)
  readonly password: string


  @IsPhoneNumber('UA')
  readonly phone: string


  @IsEmail()
  readonly email: string
}