import {IsEmail, IsString, MinLength, IsPhoneNumber} from 'class-validator'

export class UpdateUserDto {


  readonly name: string



  public password: string


  readonly phone: string


  readonly email: string
}