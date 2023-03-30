import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(type => Product, product => product.id, {nullable: false})
  product: Product

  @ManyToOne(type => User, user => user.id, {nullable: false})
  user: User
}
