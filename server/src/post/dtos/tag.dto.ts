import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TagDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please provide at least one tag' })
  name: string;
} 