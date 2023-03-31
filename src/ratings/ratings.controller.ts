import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RatingsService } from "./ratings.service";
import { Rating } from "./rating.entity";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";


@Controller("ratings")
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {
  }

  @Get()
  getAll(): Promise<Rating[]> {
    return this.ratingsService.findAll();
  }

  @Get(":id")
  getOne(@Param("id") id: number): Promise<Rating> {
    return this.ratingsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    if (await this.ratingsService.ifAlreadyExist(req, createRatingDto)) {
      throw new HttpException('Rating already exist', HttpStatus.CONFLICT)
    }
    return this.ratingsService.create(req, createRatingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Request() req, @Body() updateRatingDto: UpdateRatingDto, @Param("id") id: number): Promise<any> {
    return this.ratingsService.update(req, id, updateRatingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Request() req, @Param("id") id: number) {
    return this.ratingsService.remove(req, id);
  }
}
