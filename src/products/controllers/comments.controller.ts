import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { CommentsService } from "../services/comments.service";
import { Comment } from "../entities/comment.entity";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { UpdateCommentDto } from "../dto/update-comment.dto";


@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
  }

  @Get()
  getAll(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Get(":id")
  getOne(@Param("id") id: number): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(req, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@Request() req, @Body() updateCommentDto: UpdateCommentDto, @Param("id") id: number): Promise<Comment> {
    return this.commentsService.update(req, id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Request() req, @Param("id") id: number) {
    return this.commentsService.remove(req, id);
  }
}
