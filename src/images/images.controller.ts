import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Roles } from "../auth/roles/roles.decorator";
import { Role } from "../auth/roles/roles.enum";
import { ImagesService } from "./images.service";
import { Image } from "./image.entity";
import { CreateImageDto } from "./dto/create-image.dto";
import { UpdateImageDto } from "./dto/update-image.dto";


@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {
  }

  @Get()
  getAll(): Promise<Image[]> {
    return this.imagesService.findAll();
  }

  @Get(":id")
  getOne(@Param("id") id: number): Promise<Image> {
    return this.imagesService.findOne(id);
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() createImageDto: CreateImageDto): Promise<Image> {
    return this.imagesService.create(createImageDto);
  }

  @Roles(Role.Admin)
  @Patch(":id")
  update(@Body() updateImageDto: UpdateImageDto, @Param("id") id: number): Promise<Image> {
    return this.imagesService.update(id, updateImageDto);
  }

  @Roles(Role.Admin)
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.imagesService.remove(id);
  }
}
