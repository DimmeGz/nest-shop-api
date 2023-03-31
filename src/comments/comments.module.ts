import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { Comment} from "./comment.entity";

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [TypeOrmModule.forFeature([Comment])],
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule {
}