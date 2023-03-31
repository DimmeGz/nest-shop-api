import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderRow } from "./order-row.entity";
import { Repository } from "typeorm";
import { CreateOrderRowDto } from "./dto/create-order-row.dto";
import { Product } from "../products/product.entity";

@Injectable()
export class OrderRowService {
  constructor(@InjectRepository(OrderRow) private orderRowRepository: Repository<OrderRow>,
              @InjectRepository(Product) private productRepository: Repository<Product>) {
  }

  async checkProductsAvailability (orderRows): Promise<any> {
    for await (let row of orderRows) {
      const productInstance = await this.productRepository.findOneOrFail({ where: { id: row.product } });
      if (!productInstance.isAvailable) {
        throw new HttpException(`Product ${productInstance.name} is not available`, HttpStatus.NOT_ACCEPTABLE)
      }
      if (productInstance.count < row.qty) {
        throw new HttpException(`Not enough product ${productInstance.name} on warehouse`, HttpStatus.NOT_ACCEPTABLE)
      }
    }
    return
  }
  async create(orderRows: CreateOrderRowDto[]) {
    await this.checkProductsAvailability(orderRows)


  }




}