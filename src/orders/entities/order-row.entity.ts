import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "../../products/entities/product.entity";


@Entity()
export class OrderRow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Order, user => user.id, {nullable: false})
  // @JoinColumn({name: "id"})
  order: Order

  @ManyToOne(type => Product, product => product.id, {nullable: false})
  product: Product

  @Column()
  qty: number;
}
