import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>) {}

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
      newUser.role = "user";
      await User.save(newUser);

      return newUser;
    } catch (e) {
      console.log(e);
      
      throw new BadRequestException
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneByOrFail({ id });
      Object.assign(user, updateUserDto)
      await User.update({ id }, user)
      return user;
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

  async updateUserBallance (userId: number, orderSum: number, status: string, manager) {
    const user = await manager.findOne(User, { where: { id: userId } })
    if (status === 'completed') {
      if (user.ballance - orderSum < 0){
        throw new BadRequestException
      }
      await manager.update(User, userId, {ballance: user.ballance - orderSum})
    } else {
      await manager.update(User, userId, {ballance: user.ballance + orderSum})
    }
  }
}