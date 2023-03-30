import { Body, Controller, Delete, Get, Param, Patch, Post, Response, Request } from "@nestjs/common";
// import { UpdateUserDto } from "./dto/update-user.dto";

import { Roles } from "../../auth/roles/roles.decorator";
import { Role } from "../../auth/roles/roles.enum";
import { Category } from "../entities/category.entity";
import { CategoriesService } from "../services/categories.service";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";


@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {
  }

  @Get()
  getAll(@Request() req): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  getOne(@Request() req, @Param("id") id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Roles(Role.Admin)
  @Patch(":id")
  update(@Body() updateCategoryDto: UpdateCategoryDto, @Param("id") id: number): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Roles(Role.Admin)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.categoriesService.remove(id);
  }
}
