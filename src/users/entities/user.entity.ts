import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

type UserRoleType = "admin" | "user"


@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  role: string
}
