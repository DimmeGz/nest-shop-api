import { IsNumber, Min } from "class-validator";

export class CreateOrderRowDto {
  @IsNumber()
  @Min(1)
  readonly qty: number

  @IsNumber()
  readonly product: number
}