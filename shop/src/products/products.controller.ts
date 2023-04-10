import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/roles.enum";
import { UpdateProductDto } from "./dto/update-product.dto";


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
  @Post()
  create(@Request() req, @Body() createProductDto: CreateProductDto): Promise<any> {
    return this.productsService.create(req, createProductDto);
  }

  @Roles(Role.Supplier)
  @Patch(":id")
  update(@Request() req, @Body() updateProductDto: UpdateProductDto, @Param("id") id: number): Promise<Product> {
    return this.productsService.update(req, id, updateProductDto);
  }
}
