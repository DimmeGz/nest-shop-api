import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

type UserRoleType = "admin" | "user"


@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  role: string
}
