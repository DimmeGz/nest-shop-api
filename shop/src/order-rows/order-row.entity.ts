import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "../orders/order.entity";
import { Product } from "../products/product.entity";


@Entity()
export class OrderRow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, user => user.id, {nullable: false})
  @JoinColumn({name: "id"})
  order: Order

  @ManyToOne(() => Product, product => product.id, {nullable: false})
  product: Product

  @Column()
  qty: number;
}
