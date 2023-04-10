import { BaseUser } from "../utils/base-user.entity";
import { Entity, Column } from "typeorm";

@Entity()
export class User extends BaseUser {
  @Column()
  role: string
}
