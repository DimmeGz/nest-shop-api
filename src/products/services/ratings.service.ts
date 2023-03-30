import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Rating } from "../entities/rating.entity";
import { CreateRatingDto } from "../dto/create-rating.dto";
import { UpdateRatingDto } from "../dto/update-rating.dto";

@Injectable()
export class RatingsService {
  constructor(@InjectRepository(Rating) private ratingRepository: Repository<Rating>) {
  }
  async findAll(): Promise<Rating[]> {
    try {
      return await this.ratingRepository.find();
    } catch (e) {
      return e;
    }
  }

  async findOne(id: number): Promise<Rating> {
    try {
      return await this.ratingRepository.findOneOrFail({where: { id }, relations: ['user', 'product'] });
    } catch (e) {
      return e;
    }
  }

  async create(req, createRatingDto: CreateRatingDto) {
    try {
      const {rating, productId} = createRatingDto

      const newRating: Rating = this.ratingRepository.create({ rating, product: {id: productId}, user: {id: req.user.userId} });
      await Rating.save(newRating);

      return newRating;

    } catch (e) {
      return e;
    }
  }

  async update(req, id: number, updateRatingDto: UpdateRatingDto) {
    try {
      if (req.user.role === 'admin') {
        await this.ratingRepository.update({ id }, updateRatingDto);
        return await this.ratingRepository.findOneOrFail({where: { id }, relations: ['user', 'product'] });
      };
      const rating = await this.ratingRepository.findOneOrFail({where: { id, user: { id: req.user.userId } }, relations: ['user', 'product'] });
      Object.assign(rating, updateRatingDto)
      await rating.save()
      return rating
    } catch (e) {
      return e;
    }
  }

  async remove(req, id: number) {
    try {
      let result
      if (req.user.role === 'admin') {
        result = await this.ratingRepository.delete(id);
      } else {
        result = await this.ratingRepository.delete({ id, user: { id: req.user.userId } });
      }
      return result;
    } catch (e) {
      return e;
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
      return e
    }
  }
}