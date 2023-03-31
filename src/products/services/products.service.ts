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

  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find();
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
      await Product.save(newProduct);
      return await this.productRepository.findOneOrFail({ where: { id: newProduct.id }, relations: ["category"] });
    } catch (e) {
      return e;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      await this.productRepository.update({ id }, updateProductDto);
      return await this.productRepository.findOneOrFail({ where: { id }, relations: ["category"] });
    } catch (e) {
      return e;
    }
  }
}