import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";


export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly imageUrl: string

  @IsNumber()
  @Min(0)
  readonly productId: number
}