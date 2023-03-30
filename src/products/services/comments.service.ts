import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateCommentDto } from "../dto/create-comment.dto";
import { UpdateCommentDto } from "../dto/update-comment.dto";

import { Comment } from "../entities/comment.entity";

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) {
  }
  async findAll(): Promise<Comment[]> {
    try {
      return await this.commentRepository.find();
    } catch (e) {
      return e;
    }
  }

  async findOne(id: number): Promise<Comment> {
    try {
      return await this.commentRepository.findOneOrFail({where: { id }, relations: ['user', 'product'] });
    } catch (e) {
      return e;
    }
  }

  async create(req, createCommentDto: CreateCommentDto) {
    try {
      const {text, productId} = createCommentDto

      const newComment: Comment = this.commentRepository.create({ text, product: {id: productId}, user: {id: req.user.userId} });
      await Comment.save(newComment);

      return newComment;

    } catch (e) {
      return e;
    }
  }

  async update(req, id: number, updateCommentDto: UpdateCommentDto) {
    try {
      if (req.user.role === 'admin') {
        await this.commentRepository.update({ id }, updateCommentDto);
        return await this.commentRepository.findOneOrFail({where: { id }, relations: ['user', 'product'] });
      };
      const comment = await this.commentRepository.findOneOrFail({where: { id, user: { id: req.user.userId } }, relations: ['user', 'product'] });
      Object.assign(comment, updateCommentDto)
      await comment.save()
      return comment
    } catch (e) {
      return e;
    }
  }

  async remove(req, id: number) {
    try {
      let result
      if (req.user.role === 'admin') {
        result = await this.commentRepository.delete(id);
      } else {
        result = await this.commentRepository.delete({ id, user: { id: req.user.userId } });
      }
      return result;
    } catch (e) {
      return e;
    }
  }
}