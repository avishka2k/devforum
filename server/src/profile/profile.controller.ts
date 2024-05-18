import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Profile } from './entites/profile.entity';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dtos/profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth') 
@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService,
    ) {}

    @UseGuards(AuthGuard)
    @Get(':id')
    getProfile(@Param('id') id: number){
        return this.profileService.getProfile(id);
    }

    @UseGuards(AuthGuard)
    @Post('update')
    updateProfile(@Body() dto: ProfileDto){
        return this.profileService.updateProfile(dto);
    }
}
