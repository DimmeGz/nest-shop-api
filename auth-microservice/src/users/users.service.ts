import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>) { }


  async findByAuthField(username: string): Promise<any> {
    try {
      return await this.userRepository.findOneByOrFail([{ phone: username }, { email: username }]);
    } catch (e) {
      throw new NotFoundException
    }
  }
}