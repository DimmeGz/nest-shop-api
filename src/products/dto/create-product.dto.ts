import { IsNotEmpty, IsString, MinLength, IsOptional, IsNumber, Min, IsBoolean } from "class-validator";


export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly name: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly description: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly price: number

  @IsBoolean()
  readonly isAvailable: boolean

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly buyersCount: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly rating: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly count: number
}