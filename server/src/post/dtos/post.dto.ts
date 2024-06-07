import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PostDto {
    
  @ApiProperty()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [String] })
  @IsNotEmpty({ message: 'Please provide at least one tag' })
  tags: string[];

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ type: 'string'})
  is_published: string;

  @ApiProperty({ type: 'date-time'})
  publish_at: Date;

}