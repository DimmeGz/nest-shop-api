import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ProductsService } from "../products/products.service";


@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
              private readonly productsService: ProductsService) {
  }
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (e) {
      throw new BadRequestException
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory: Category = this.categoryRepository.create(createCategoryDto);
      return Category.save(newCategory);
    } catch (e) {
      throw new BadRequestException
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update({ id }, updateCategoryDto);
      return await this.categoryRepository.findOneByOrFail({ id });
    } catch (e) {
      throw new NotFoundException
    }
  }

  async remove(id: number) {
    try {
      const result = await this.categoryRepository.delete(id);
      return result;
    } catch (e) {
      throw new NotFoundException
    }
  }
}