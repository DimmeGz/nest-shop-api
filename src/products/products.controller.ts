import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { Roles } from "../auth/roles/roles.decorator";
import { Role } from "../auth/roles/roles.enum";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";



@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
  }

  @Get()
  getAll(@Query() query): Promise<Product[]> {
    return this.productsService.findAndCountAll(query);
  }

  @Get('/category/:id')
  getByCategory(@Param("id") id: number, @Query() query): Promise<any> {
    return this.productsService.findByCategory(id, query)
  }

  @Get(":id")
  getOne(@Param("id") id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Roles(Role.Supplier)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createProductDto: CreateProductDto): Promise<any> {
    return this.productsService.create(req, createProductDto);
  }

  @Roles(Role.Admin)
  @Patch(":id")
  update(@Body() updateProductDto: UpdateProductDto, @Param("id") id: number): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }
}
