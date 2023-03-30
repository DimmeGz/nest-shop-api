import { IsEnum } from "class-validator";
import { StatusEnum } from "./enum/status.enum";
import { OrderRow } from "../entities/order-row.entity";

export class UpdateOrderDto {
  @IsEnum(StatusEnum)
  readonly status: string

  readonly orderRows: OrderRow
}