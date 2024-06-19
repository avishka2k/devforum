import { IsOptional, IsString } from 'class-validator';

export class SocialLinkDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  url: string;
}
