import { Body, Controller, Delete, Get, Param, Patch, Post, Response, Request } from "@nestjs/common";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";
// import { Roles } from "../auth/roles/roles.decorator";
// import { Role } from "../auth/roles/roles.enum";
import { ProductsService } from "../services/products.service";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "../dto/create-product.dto";
import { Roles } from "../../auth/roles/roles.decorator";
import { Role } from "../../auth/roles/roles.enum";
import { UpdateProductDto } from "../dto/update-product.dto";


@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  @Get()
  getAll(@Request() req): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(":id")
  getOne(@Request() req, @Param("id") id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() createProductDto: CreateProductDto): Promise<string> {
    return this.productsService.create(createProductDto);
  }

  @Roles(Role.Admin)
  @Patch(":id")
  update(@Body() updateProductDto: UpdateProductDto, @Param("id") id: number): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Roles(Role.Admin)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.productsService.remove(id);
  }
}
