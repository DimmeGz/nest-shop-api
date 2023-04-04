import { BaseUser } from "src/utils/base-user.entity";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class Supplier extends BaseUser {
  @Column()
  role: string
}
