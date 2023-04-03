import { IsEnum } from "class-validator";
import { OrderStatusEnum } from "../enum/order-status.enum";
import { CreateOrderRowDto } from "../../order-rows/dto/create-order-row.dto";

export class CreateOrderDto {
  @IsEnum(OrderStatusEnum)
  readonly status: string

  readonly orderRows: CreateOrderRowDto[]
}