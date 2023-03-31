import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";
import { Image } from "./image.entity";

@Module({
  providers: [ImagesService],
  controllers: [ImagesController],
  imports: [TypeOrmModule.forFeature([Image])],
  exports: [ImagesService, TypeOrmModule],
})
export class ImagesModule {
}