import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Image } from "../entities/image.entity";
import { CreateImageDto } from "../dto/create-image.dto";
import { UpdateImageDto } from "../dto/update-image.dto";


@Injectable()
export class ImagesService {
  constructor(@InjectRepository(Image) private imageRepository: Repository<Image>) {
  }

  async findAll(): Promise<Image[]> {
    try {
      return await this.imageRepository.find();
    } catch (e) {
      return e;
    }
  }

  async findOne(id: number): Promise<Image> {
    try {
      return await this.imageRepository.findOneOrFail({ where: { id }, relations: ["product"] });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(createImageDto: CreateImageDto) {
    try {
      const { imageUrl, productId } = createImageDto;

      const newImage: Image = this.imageRepository.create({ imageUrl, product: { id: productId } });
      await Image.save(newImage);

      return newImage;
    } catch (e) {
      return e;
    }
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    try {
      await this.imageRepository.update({ id }, updateImageDto);
      return await this.imageRepository.findOneByOrFail({ id });
    } catch (e) {
      return e;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.imageRepository.delete(id);
      return result;
    } catch (e) {
      return e;
    }
  }
}