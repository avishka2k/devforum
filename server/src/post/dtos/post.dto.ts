import { ApiProperty } from '@nestjs/swagger';

export class PosDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;
    
}