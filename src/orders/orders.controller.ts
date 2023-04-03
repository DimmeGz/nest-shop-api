import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Order } from "./order.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";


@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Request() req, @Query() query): Promise<Order[]> {
    return this.ordersService.findAll(req, query);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  getOne(@Request() req, @Param("id") id: number): Promise<Order> {
    return this.ordersService.findOne(req, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req, createOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Request() req, @Body() updateOrderDto: UpdateOrderDto, @Param("id") id: number): Promise<any> {
    return this.ordersService.update(req, id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Request() req, @Param("id") id: number) {
    return this.ordersService.remove(req, id);
  }
}
