import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";


@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (e) {
      throw e;
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser: User = this.userRepository.create(createUserDto);
      newUser.password = await bcrypt.hash(newUser.password, 10);
      newUser.role = "user";
      await User.save(newUser);

      const JWTKey = process.env.JWT_SECRET;
      const payload = { id: newUser.id, role: newUser.role };
      const token = jwt.sign({ user: payload }, JWTKey!);

      return token;
    } catch (e) {
      throw e;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      // const user = await this.userRepository.findOneByOrFail({ id });
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      await this.userRepository.update({ id }, updateUserDto);
      return await this.userRepository.findOneByOrFail({ id });
    } catch (e) {
      throw e;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.userRepository.delete(id);
      return result;
    } catch (e) {
      throw e;
    }
  }

  async findByName(username: string): Promise<any> {
    return await this.userRepository.findOneByOrFail([{ phone: username }, { email: username }]);
  }

  async checkUnique(property: Object): Promise<User> {
    return await this.userRepository.findOneBy(property);
  }
}