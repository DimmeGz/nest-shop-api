import { IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";


export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly text: string

  @IsNumber()
  @Min(0)
  readonly productId: number
}