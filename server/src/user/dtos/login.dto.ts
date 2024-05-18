import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'This field cannot be empty' })
    username: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'This field cannot be empty' })
    password: string;
}