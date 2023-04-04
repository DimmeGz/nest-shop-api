import { BaseUser } from "src/utils/base-user.entity";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseUser {
  @Column()
  role: string
}
