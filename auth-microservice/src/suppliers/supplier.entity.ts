import { BaseUser } from "../utils/base-user.entity";
import { Entity, Column } from "typeorm";

@Entity()
export class Supplier extends BaseUser {
}
