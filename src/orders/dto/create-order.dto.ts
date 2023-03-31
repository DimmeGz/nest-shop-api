import { IsEnum } from "class-validator";
import { OrderStatusEnum } from "../enum/order-status.enum";
import { OrderRow } from "../../order-rows/order-row.entity";

export class CreateOrderDto {
  @IsEnum(OrderStatusEnum)
  readonly status: string

  readonly orderRows: OrderRow
}