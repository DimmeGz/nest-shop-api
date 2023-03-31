import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { User } from "../users/user.entity";
import { OrderRow } from "../order-rows/order-row.entity";


@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.id, {nullable: false})
  user: User

  @Column({default: 0})
  sum: number;

  @Column()
  status: string;

  @OneToMany(type => OrderRow, orderRow => orderRow.order)
  orderRows: OrderRow[];
}
