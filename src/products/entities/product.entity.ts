import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

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

  // @Column()
  // CategoryId: number

  @Column({ default: 0 })
  buyersCount: number

  @Column({ default: 0 })
  rating: number

  @Column({ default: 0 })
  count: number
}
