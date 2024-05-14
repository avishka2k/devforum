import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Profile } from './entites/profile.entity';
import { ProfileService } from './profile.service';
import { UserDto } from './dtos/user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth') 
@Controller('profile')
export class ProfileController {
    constructor(
        private profileService: ProfileService,
    ) {}

    // @UseGuards(AuthGuard)
    // @Get('/')
    // getProfile(@Body() dto: UserDto){
    //     return this.profileService.getProfile(dto);
    // }

    @UseGuards(AuthGuard)
    @Post('update')
    updateProfile(@Body() dto: UserDto){
        return this.profileService.updateProfile(dto);
    }
}
