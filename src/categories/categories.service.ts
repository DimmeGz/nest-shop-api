import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Product } from "../products/product.entity";


@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
              @InjectRepository(Product) private productRepository: Repository<Product>) {
  }
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const category = await this.categoryRepository.findOneOrFail({ where: { id } });
      const products = await this.productRepository.find({ where: {category: { id: category.id }}})
      return { category, products }
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory: Category = this.categoryRepository.create(createCategoryDto);
      return Category.save(newCategory);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update({ id }, updateCategoryDto);
      return await this.categoryRepository.findOneByOrFail({ id });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.categoryRepository.delete(id);
      return result;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}