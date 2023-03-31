import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
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
  getAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(":id")
  getOne(@Param("id") id: number): Promise<Product> {
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
}
