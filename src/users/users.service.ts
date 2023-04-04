import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, 
    private jwtService: JwtService) {
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw new BadRequestException
    }
  }

  async findOne(req, id: number): Promise<User> {
    try {
      if (req.user.userId === +id) {
        return await this.userRepository.findOneByOrFail({ id });
      }
      throw new ForbiddenException
    } catch (e) {
      throw new BadRequestException
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
      // const token = jwt.sign({ user: payload }, JWTKey!);
      const token = this.jwtService.sign(payload)

      return token;
    } catch (e) {
      console.log(e);
      
      throw new BadRequestException
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      await this.userRepository.update({ id }, updateUserDto);
      return await this.userRepository.findOneByOrFail({ id });
    } catch (e) {
      throw new NotFoundException
    }
  }

  async remove(id: number) {
    try {
      const result = await this.userRepository.delete(id);
      return result;
    } catch (e) {
      throw new NotFoundException
    }
  }

  async findByName(username: string): Promise<any> {
    try {
      return await this.userRepository.findOneByOrFail([{ phone: username }, { email: username }]);
    }catch (e) {
      throw new NotFoundException
    }
  }

  async checkUnique(property: Object): Promise<User> {
    try {
      return await this.userRepository.findOneBy(property);
    } catch (e) {
      throw new BadRequestException
    }
  }
}