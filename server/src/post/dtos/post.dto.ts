import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PosDto {
    
  @ApiProperty()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [String] })
  @IsArray({ message: 'Tags must be an array' })
  tags: string[];

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

}