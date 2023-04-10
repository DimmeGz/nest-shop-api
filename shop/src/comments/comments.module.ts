import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { Comment} from "./comment.entity";
import { RabbitMQModule } from "../rabbit-mq/rabbit-mq.module";

@Module({
  providers: [CommentsService],
  controllers: [CommentsController],
  imports: [
    TypeOrmModule.forFeature([Comment]), 
    RabbitMQModule
  ],
  exports: [CommentsService],
})
export class CommentsModule {
}