import { IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";

export class UpdateCategoryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly description: string
}