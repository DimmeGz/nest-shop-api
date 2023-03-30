import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "../dto/create-product.dto";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";


@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (e) {
      return e;
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      return await this.categoryRepository.findOneByOrFail({ id });
    } catch (e) {
      return e;
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory: Category = this.categoryRepository.create(createCategoryDto);
      await Category.save(newCategory);

      return newCategory;
    } catch (e) {
      return e;
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update({ id }, updateCategoryDto);
      return await this.categoryRepository.findOneByOrFail({ id });
    } catch (e) {
      return e;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.categoryRepository.delete(id);
      return result;
    } catch (e) {
      return e;
    }
  }
}