import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";


@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    try {
      return await this.productRepository.find({ where: {category: { id: categoryId }}})
    } catch (e) {
      return e;
    }
  }

  async findAndCountAll(query: { take: number; page: number; }): Promise<any> {
    try {
      const take = query.take || 10
      const page = query.page || 1
      const skip = (page - 1) * query.take || 0
      const [result, total] = await this.productRepository.findAndCount({take: take, skip: skip});
      return {
        page: page,
        totalPages: Math.ceil(total / take),
        elementsCount: total,
        data: result
      }
    } catch (e) {
      return e;
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      return await this.productRepository.findOneOrFail({ where: { id }, relations: ["category"] });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct: Product = this.productRepository.create(createProductDto);
      if (newProduct.count === 0) {
        newProduct.isAvailable = false
      }
      return Product.save(newProduct);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOneOrFail({ where: { id }, relations: ["category"]  } )
      Object.assign(product, updateProductDto)
      if (product.count === 0) {
        product.isAvailable = false
      }
      return product.save()
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}