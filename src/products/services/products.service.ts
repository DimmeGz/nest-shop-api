import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { Comment } from "../entities/comment.entity";
import { Image } from "../entities/image.entity";
import { OrderRow } from "../../orders/entities/order-row.entity";


@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private productRepository: Repository<Product>,
              @InjectRepository(OrderRow) private orderRowRepository: Repository<OrderRow>,
              @InjectRepository(Comment) private commentRepository: Repository<Comment>,
              @InjectRepository(Image) private imageRepository: Repository<Image>) {
  }

  async findAll(query): Promise<any> {
    try {
      const take = query.take || 10
      const skip = query.skip || 0
      const [result, total] = await this.productRepository.findAndCount({take: take, skip: skip});
      return {
        data: result,
        count: total
      }
    } catch (e) {
      return e;
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      return await this.productRepository.findOneOrFail({ where: { id }, relations: ["category"] });
    } catch (e) {
      return e;
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct: Product = this.productRepository.create(createProductDto);
      if (newProduct.count === 0) {
        newProduct.isAvailable = false
      }
      await Product.save(newProduct);
      return await this.productRepository.findOneOrFail({ where: { id: newProduct.id }, relations: ["category"] });
    } catch (e) {
      return e;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOneOrFail({ where: { id }, relations: ["category"]  } )
      Object.assign(product, updateProductDto)
      if (product.count === 0) {
        product.isAvailable = false
      }
      await product.save()

      return product
    } catch (e) {
      return e;
    }
  }
}