import { Column, PrimaryGeneratedColumn, BaseEntity, BeforeInsert, BeforeUpdate } from "typeorm";
import * as bcrypt from "bcryptjs";

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
