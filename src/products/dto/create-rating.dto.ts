import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";


export class CreateRatingDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  readonly rating: number

  @IsNumber()
  @Min(0)
  readonly productId: number
}