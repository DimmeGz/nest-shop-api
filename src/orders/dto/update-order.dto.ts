import { IsEnum } from "class-validator";
import { StatusEnum } from "./enum/status.enum";

export class UpdateOrderDto {
  @IsEnum(StatusEnum)
  readonly status: string
}