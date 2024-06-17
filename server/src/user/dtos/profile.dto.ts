import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {

    @ApiProperty()
    fullname: string;

    @ApiProperty()
    headline: string;

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