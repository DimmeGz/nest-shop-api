import { IsEnum } from "class-validator";
import { OrderStatusEnum } from "../enum/order-status.enum";

export class UpdateOrderDto {
  @IsEnum(OrderStatusEnum)
  readonly status: string

  readonly orderRows
}