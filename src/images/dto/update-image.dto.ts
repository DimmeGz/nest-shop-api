import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class UpdateImageDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly imageUrl: string
}