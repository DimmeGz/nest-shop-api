import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Supplier } from "./supplier.entity";


@Injectable()
export class SuppliersService {
  constructor(@InjectRepository(Supplier) private supplierRepository: Repository<Supplier>) {
  }

  
}