import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Supplier } from "./supplier.entity";

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>) { }


  async findByAuthField(username: string): Promise<any> {
    try {
      return await this.supplierRepository.findOneByOrFail([{ phone: username }, { email: username }]);
    } catch (e) {
      throw new NotFoundException
    }
  }
}