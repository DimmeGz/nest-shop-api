import { Body, Controller, Get, Post, UseGuards, Request, Param } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/roles/roles.decorator";
import { Role } from "src/auth/roles/roles.enum";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { Supplier } from "./supplier.entity";

import { SuppliersService } from "./suppliers.service";


@Controller("suppliers")
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {
  }

  @Get()
  @Roles(Role.Admin)
  getAll(): Promise<Supplier[]> {
    return this.suppliersService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  getOne(@Request() req, @Param("id") id: number): Promise<Supplier> {
      return this.suppliersService.findOne(req, id);
  }

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<string> {
    return this.suppliersService.create(createSupplierDto);
  }


}
