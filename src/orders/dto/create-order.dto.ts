import { IsEnum } from "class-validator";
import { StatusEnum } from "./enum/status.enum";

export class CreateOrderDto {
  @IsEnum(StatusEnum)
  readonly status: string
}