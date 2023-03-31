import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { Product } from "../products/product.entity";
import { User } from "../users/entities/user.entity";

@Entity()
export class Rating extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @ManyToOne(type => Product, product => product.id, {nullable: false})
  product: Product

  @ManyToOne(type => User, user => user.id, {nullable: false})
  user: User
}
