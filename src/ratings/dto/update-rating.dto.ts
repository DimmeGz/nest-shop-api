import { IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from "class-validator";


export class UpdateRatingDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  readonly rating: number
}