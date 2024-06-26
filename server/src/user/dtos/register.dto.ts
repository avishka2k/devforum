import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'This field cannot be empty' })
    fullname: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'This field cannot be empty' })
    username: string;

    @ApiProperty()
    @IsEmail({}, {message: 'Email must be an email'})
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'This field cannot be empty' })
    password: string;
}
