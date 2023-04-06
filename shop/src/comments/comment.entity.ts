import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { Product } from "../products/product.entity";
import { User } from "../users/user.entity";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Product, product => product.id, {nullable: false})
  product: Product

  @ManyToOne(() => User, user => user.id, {nullable: false, onDelete: "CASCADE"})
  user: User
}
