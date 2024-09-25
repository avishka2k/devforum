import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  headline: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  link1: string;

  @ApiProperty()
  link2: string;

  @ApiProperty()
  link3: string;

  @ApiProperty()
  link4: string;

  @ApiProperty()
  updated_at: Date;
}
