import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

import { Comment } from "./comment.entity";

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) {
  }
  async findAll(): Promise<Comment[]> {
    try {
      return await this.commentRepository.find();
    } catch (e) {
      throw new BadRequestException
    }
  }

  async findOne(id: number): Promise<Comment> {
    try {
      return await this.commentRepository.findOneOrFail({where: { id }, relations: ['user', 'product'] });
    } catch (e) {
      throw new NotFoundException
    }
  }

  async create(req, createCommentDto: CreateCommentDto) {
    try {
      const {text, productId} = createCommentDto

      const newComment: Comment = this.commentRepository.create({ text, product: {id: productId}, user: {id: req.user.userId} });
      return Comment.save(newComment);
    } catch (e) {
      throw new BadRequestException
    }
  }

  async update(req, id: number, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.commentRepository.findOneOrFail({where: { id, user: { id: req.user.userId } }, relations: ['user', 'product'] });
      Object.assign(comment, updateCommentDto)
      return comment.save()
    } catch (e) {
      throw new NotFoundException
    }
  }

  async remove(req, id: number) {
    try {
      const result = await this.commentRepository.delete({ id, user: { id: req.user.userId } });
      if (result.affected) {
        return result;
      }
      throw new NotFoundException
    } catch (e) {
      throw new BadRequestException
    }
  }
}