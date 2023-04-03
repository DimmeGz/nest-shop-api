import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";


@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>) {
  }

  async findByCategory(categoryId: number, query: { take: number; page: number; }): Promise<any> {
    try {
      const take = query.take || 10
      const page = query.page || 1
      const skip = (page - 1) * query.take || 0
      const [result, total] = await this.productRepository.findAndCount({where: {category: { id: categoryId }}, take: take, skip: skip});
      return {
        page: page,
        totalPages: Math.ceil(total / take),
        elementsCount: total,
        data: result
      }
    } catch (e) {
      throw new BadRequestException
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
      throw new BadRequestException
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      return await this.productRepository.findOneOrFail({ where: { id }, relations: ["category"] });
    } catch (e) {
      throw new NotFoundException
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
      throw new BadRequestException
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
      throw new NotFoundException
    }
  }

  async updateByOrderRow (orderStatus: string, productInstance: Product, qty: number, manager) {
    if (orderStatus === 'completed') {
      productInstance.buyersCount += 1
    }
    productInstance.count -= qty
    if (productInstance.count === 0) {
      productInstance.isAvailable = false
    }

    await manager.update(Product, 
      productInstance.id, 
      { isAvailable: productInstance.isAvailable, buyersCount: productInstance.buyersCount, count: productInstance.count } )
  }
}