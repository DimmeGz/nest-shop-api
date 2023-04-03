import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Rating } from "./rating.entity";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { ProductsService } from "src/products/products.service";

@Injectable()
export class RatingsService {
  constructor(@InjectRepository(Rating) private ratingRepository: Repository<Rating>,
              private readonly productsService: ProductsService) {
  }
  async findAll(): Promise<Rating[]> {
    try {
      return await this.ratingRepository.find();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<Rating> {
    try {
      return await this.ratingRepository.findOneOrFail({where: { id }, relations: ['user', 'product'] });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(req, createRatingDto: CreateRatingDto) {
    try {
      const {rating, productId} = createRatingDto

      const newRating: Rating = this.ratingRepository.create({ rating, product: {id: productId}, user: {id: req.user.userId} });

      const product = await this.productsService.findOne(productId);
      if (!product.rating) {
        product.rating = rating
      } else {
        const allRatings = await this.ratingRepository.find({ where: { product: {id: productId}} })
        const sumRating = allRatings.reduce((acc, obj) => { return acc + obj.rating }, 0)
        product.rating = (sumRating + rating) / (allRatings.length + 1)
      }
      await product.save()

      return Rating.save(newRating);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(req, id: number, updateRatingDto: UpdateRatingDto) {
    try {
      let rating
      if (req.user.role === 'admin') {
        rating = await this.ratingRepository.findOneOrFail({where: { id }, relations: ['user', 'product'] });
      } else {
        rating = await this.ratingRepository.findOneOrFail({
          where: { id, user: { id: req.user.userId } },
          relations: ["user", "product"]
        });
      }

      const product = await this.productsService.findOne(rating.product.id);
      const allRatings = await this.ratingRepository.find({ where: { product: {id: product.id}} })
      const sumRating = allRatings.reduce((acc, obj) => { return acc + obj.rating }, 0)
      product.rating = (sumRating + updateRatingDto.rating - rating.rating) / allRatings.length
      await product.save()

      Object.assign(rating, updateRatingDto)
      return await Rating.save(rating)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.FORBIDDEN);
    }
  }

  async remove(req, id: number) {
    try {
      let rating
      if (req.user.role === 'admin') {
        rating = await this.ratingRepository.findOneOrFail({where: { id }, relations: ['user', 'product'] });
      } else {
        rating = await this.ratingRepository.findOneOrFail({
          where: { id, user: { id: req.user.userId } },
          relations: ["user", "product"]
        });
      }
      const product = await this.productsService.findOne(rating.product.id);
      const allRatings = await this.ratingRepository.find({ where: { product: {id: product.id}} })
      if (allRatings.length === 1) {
        product.rating = 0
        await product.save()
      } else {
        let sumRating = allRatings.reduce((acc, obj) => { return acc + obj.rating }, 0) - rating.rating
        product.rating = sumRating / (allRatings.length - 1)
        await product.save()
      }
      await Rating.remove(rating)
      return { deleted: id };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.FORBIDDEN);
    }
  }

  async ifAlreadyExist(req, createRatingDto: CreateRatingDto){
    try {
      const { productId } = createRatingDto
      const existingRating = await this.ratingRepository.findOne({
        where: {
          product: { id: productId },
          user: { id: req.user.userId }
        }
      })
      if (existingRating) {
        return true
      }
      return false
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}