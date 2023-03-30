import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinTable } from "typeorm";
import { Category } from "./category.entity";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  price: number

  @Column({ default: true })
  isAvailable: boolean

  @Column({ default: 0 })
  buyersCount: number

  @Column({ default: 0 })
  rating: number

  @Column({ default: 0 })
  count: number

  @ManyToOne(type => Category, category => category.id)
  category: Category
}
