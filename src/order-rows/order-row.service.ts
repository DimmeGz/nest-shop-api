import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderRow } from "./order-row.entity";
import { Repository } from "typeorm";
import { CreateOrderRowDto } from "./dto/create-order-row.dto";
import { Product } from "../products/product.entity";
import { ProductsService } from "src/products/products.service";

@Injectable()
export class OrderRowService {
  constructor(@InjectRepository(OrderRow) private orderRowRepository: Repository<OrderRow>,
              private readonly productsService: ProductsService) {
  }

  async checkProductsAvailability (orderRows): Promise<any> {
    for await (let row of orderRows) {
      const productInstance = await this.productsService.findOne(row.product)
      if (!productInstance.isAvailable) {
        throw new HttpException(`Product ${productInstance.name} is not available`, HttpStatus.NOT_ACCEPTABLE)
      }
      if (productInstance.count < row.qty) {
        throw new HttpException(`Not enough product ${productInstance.name} on warehouse`, HttpStatus.NOT_ACCEPTABLE)
      }
    }
    return
  }

  async createOrderRows(orderRows, orderId: number): Promise<OrderRow[]> {
    try {
      let createdRows = []
      for await (let row of orderRows) {
        const newRow = await this.orderRowRepository.save({ qty: row.qty, product: {id:row.product}, order: {id: orderId} });
        createdRows.push(newRow)
      }
      return createdRows
    } catch (e) {
      throw e
    }
  }

  async deleteRows(orderId: number, orderStatus: string) {
    try {
      const orderRows = await this.orderRowRepository.find({where: { order: { id: orderId } }, relations: ['product']});
      for await (let row of orderRows) {
        // update product.buyersCount
        const productInstance = await this.productsService.findOne(row.product.id)
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
    } catch (e) {
      throw new BadRequestException
    }
  }

  async updateProductBuyerCount (orderId: number, oldStatus: string, newStatus: string) {
    try {
      const orderRows = await this.orderRowRepository.find({where: { order: { id: orderId } }, relations: ['product']});
      for await (let row of orderRows) {
        const productInstance = await this.productsService.findOne(row.product.id)
        if (oldStatus === 'completed') {
          productInstance.buyersCount -= 1
          await Product.save(productInstance)
        }
        if (newStatus === 'completed') {
          productInstance.buyersCount += 1
          await Product.save(productInstance)
        }
      }
    } catch (e) {
      throw new BadRequestException
    }
  }

  async checkUpdateAvailability (orderId: number, newRows: Array<any>) {
    try {      
      const orderRows = await this.orderRowRepository.find({where: { order: { id: orderId } }, relations: ['product']});

      let products = new Object
      for (let orderRow of orderRows) {      
        const product = orderRow.product.id
        products[product] = orderRow.qty
      }
      
      for (let newRow of newRows) {
        const productInstance = await this.productsService.findOne(newRow.productId)
        if (productInstance.id in products) {
          if (newRow.qty > productInstance.count + products[productInstance.id]) {
            throw new HttpException(`Too much ${productInstance.name}`, HttpStatus.NOT_ACCEPTABLE);
          }
        }
      }
    } catch (e) {
      throw e;
    }
  }
}