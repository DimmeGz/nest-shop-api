import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderRow } from "./order-row.entity";
import { Repository } from "typeorm";
import { Product } from "../products/product.entity";
import { ProductsService } from "src/products/products.service";
import { Supplier } from "src/suppliers/supplier.entity";

@Injectable()
export class OrderRowService {
  constructor(@InjectRepository(OrderRow) private orderRowRepository: Repository<OrderRow>,
              private readonly productsService: ProductsService) {
  }

  async checkProductsAvailability (orderRows, manager): Promise<any> {
    for await (let row of orderRows) {
      const productInstance = await manager.findOne(Product, { where: { id: row.product } } )
      if (!productInstance.isAvailable) {
        throw new HttpException(`Product ${productInstance.name} is not available`, HttpStatus.NOT_ACCEPTABLE)
      }
      if (productInstance.count < row.qty) {
        throw new HttpException(`Not enough product ${productInstance.name} on warehouse`, HttpStatus.NOT_ACCEPTABLE)
      }
    }
    return
  }

  async createOrderRows(orderRows, orderId: number, manager): Promise<OrderRow[]> {
    try {
      let createdRows = []
      for await (let row of orderRows) {
        const newRow = await manager.save(OrderRow, { qty: row.qty, product: { id:row.product }, order: { id: orderId } } );
        createdRows.push(newRow)
      }
      return createdRows
    } catch (e) {
      throw e
    }
  }

  async getRowsByOrder (orderId: number, manager): Promise<OrderRow[]> {
    try {
      return await manager.find(OrderRow, {where: { order: { id: orderId } }, relations: [ 'product' ] } );
    } catch (e) {
      throw new BadRequestException
    }
  }

  async deleteRows(orderRows: OrderRow[], orderStatus: string, manager) {
    try {
      for await (let row of orderRows) {
        const productInstance = await manager.findOne(Product, { where: { id: row.product.id } } )

        if (orderStatus === 'completed') {
          productInstance.buyersCount -= 1
        }
        if (productInstance.count === 0) {
          productInstance.isAvailable = true
        }
        productInstance.count += row.qty
        await manager.update(
          Product, 
          { id: productInstance.id }, 
          { isAvailable:productInstance.isAvailable, buyersCount:productInstance.buyersCount, count: productInstance.count }
          )
        await manager.delete(OrderRow, {id:row.id})
      }
    } catch (e) {
      throw new BadRequestException
    }
  }

  async updateProductBuyerCount (orderRows, oldStatus: string, newStatus: string, manager) {
    try {
      for await (let row of orderRows) {
        const productInstance = await manager.findOne(Product, { where: { id: row.product.id } } )
        if (oldStatus === 'completed') {
          productInstance.buyersCount -= 1
        }
        if (newStatus === 'completed') {
          productInstance.buyersCount += 1
        }
        await manager.update(Product, productInstance.id, { buyersCount: productInstance.buyersCount } )
      }
    } catch (e) {
      throw new BadRequestException
    }
  }

  async checkUpdateAvailability (orderId: number, newRows: Array<any>, manager) {
    try {
      const orderRows = await manager.find(OrderRow, {where: { order: { id: orderId } }, relations: [ 'product' ] } );

      let products = new Object
      for (let orderRow of orderRows) {      
        const product = orderRow.product.id
        products[product] = orderRow.qty
      }
      
      for (let newRow of newRows) {
        const productInstance = await manager.findOne(Product, { where: { id: newRow.productId } } )
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

  async updateSuppliersBallance (rows: OrderRow[], status, manager) {
    try {
      for (let row of rows) {
        const productInstance = await manager.findOne(Product, { where: { id: row.product.id }, relations: ["supplier"] } )

        const supplier = await manager.findOne(Supplier, { where: { id: productInstance.supplier.id } } )

        if (status === 'completed') {
          await manager.update(Supplier, supplier.id, { ballance: supplier.ballance + (productInstance.price * row.qty) })
        } else {
          if (supplier.ballance - (productInstance.price * row.qty) < 0){
            throw new BadRequestException
          }
          await manager.update(Supplier, supplier.id, { ballance: supplier.ballance - (productInstance.price * row.qty) })
        }
      }
    } catch (e) {

    }
  }
}