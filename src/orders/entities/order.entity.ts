import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";


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
}
