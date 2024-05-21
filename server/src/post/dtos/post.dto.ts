import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PosDto {

    @ApiProperty()
    @IsNotEmpty({ message: 'Title cannot be empty' })
    title: string;

    @ApiProperty()
    content: string;

}