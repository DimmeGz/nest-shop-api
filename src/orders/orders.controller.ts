import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Order } from "./entities/order.entity";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";


@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Request() req): Promise<Order[]> {
    return this.ordersService.findAll(req);
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
  update(@Request() req, @Body() updateOrderDto: UpdateOrderDto, @Param("id") id: number): Promise<Comment> {
    return this.ordersService.update(req, id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Request() req, @Param("id") id: number) {
    return this.ordersService.remove(req, id);
  }
}
