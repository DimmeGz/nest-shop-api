import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  readonly text: string
}