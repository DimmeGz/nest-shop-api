import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

export abstract class BaseUser extends BaseEntity {
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

  @Column({ default: 0 })
  ballance: number
}
