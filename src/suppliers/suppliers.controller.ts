import { Body, Controller, Get, Post } from "@nestjs/common";
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

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<string> {
    return this.suppliersService.create(createSupplierDto);
  }


}
