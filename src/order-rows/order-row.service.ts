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

  async createOrderRowsAndCountSum(orderRows: CreateOrderRowDto[], orderId: number, orderStatus: string): Promise<number> {
    let orderSum: number = 0
    for await (let row of orderRows) {
      await this.orderRowRepository.save({ qty: row.qty, product: {id:row.product}, order: {id: orderId} });
      const productInstance = await this.productRepository.findOneOrFail({where: { id: row.product } });
      orderSum += productInstance.price * row.qty
      if (orderStatus === 'completed') {
        productInstance.buyersCount += 1
      }
      productInstance.count -= row.qty
      if (productInstance.count === 0) {
        productInstance.isAvailable = false
      }
      await Product.save(productInstance)
    }
    return orderSum
  }

  async deleteRows(orderId: number, orderStatus: string) {
    const orderRows = await this.orderRowRepository.find({where: { order: { id: orderId } }, relations: ['product']});
    for await (let row of orderRows) {
      // update product.buyersCount
      const productInstance = await this.productRepository.findOneOrFail({where: { id: row.product.id } });
      if (orderStatus === 'completed') {
        productInstance.buyersCount -= 1
      }
      if (productInstance.count === 0) {
        productInstance.isAvailable = true
      }
      productInstance.count += row.qty
      await Product.save(productInstance)
      await OrderRow.remove(row)
    }
  }
}