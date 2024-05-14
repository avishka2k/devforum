import { ApiProperty } from '@nestjs/swagger';

export class UserDto {

    @ApiProperty()
    id: number;
    
    @ApiProperty()
    fullname: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    bio: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    website: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    updated_at: Date;
}