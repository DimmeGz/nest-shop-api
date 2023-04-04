import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";

import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { Supplier } from "./supplier.entity";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";


@Injectable()
export class SuppliersService {
    constructor(
        @InjectRepository(Supplier) private supplierRepository: Repository<Supplier>) {}

    async findAll(): Promise<Supplier[]> {
        try {
            return await this.supplierRepository.find();
        } catch (e) {
            throw new BadRequestException
        }
    }

    async findOne(req, id: number): Promise<Supplier> {
        try {
          if (req.user.userId === +id) {
            return await this.supplierRepository.findOneByOrFail({ id });
          }
          throw new ForbiddenException
        } catch (e) {
          throw new BadRequestException
        }
      }

    async create(createSupplierDto: CreateSupplierDto) {
        try {
            const newSupplier: Supplier = this.supplierRepository.create(createSupplierDto);
            newSupplier.password = await bcrypt.hash(newSupplier.password, 10);
            await Supplier.save(newSupplier);

            return newSupplier;
        } catch (e) {
            console.log(e);
            throw new BadRequestException
        }
    }

    async update(id: number, updateSupplierDto: UpdateSupplierDto) {
        try {
          if (updateSupplierDto.password) {
            updateSupplierDto.password = await bcrypt.hash(updateSupplierDto.password, 10);
          }
          await this.supplierRepository.update({ id }, updateSupplierDto);
          return await this.supplierRepository.findOneByOrFail({ id });
        } catch (e) {
          throw new NotFoundException
        }
      }
    
      async remove(id: number) {
        try {
          const result = await this.supplierRepository.delete(id);
          return result;
        } catch (e) {
          throw new NotFoundException
        }
      }

    async findByName(username: string): Promise<any> {
        try {
          return await this.supplierRepository.findOneByOrFail([{ phone: username }, { email: username }]);
        }catch (e) {
          throw new NotFoundException
        }
      }

    async checkUnique(property: Object): Promise<Supplier> {
        try {
            return await this.supplierRepository.findOneBy(property);
        } catch (e) {
            throw new BadRequestException
        }
    }
}