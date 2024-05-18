import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from './entites/user.entity';
import { ProfileDto } from './dtos/profile.dto';
import { Profile } from './entites/profile.entity';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Post('register')
    createUser(@Body() regDto: RegisterDto){
        return this.userService.register(regDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    loginUser(@Body() loginDto: LoginDto){
        return this.userService.signIn(loginDto);
    }

    @Get(':id')
    async getUserWithProfile(@Param('id') id: number): Promise<User> {
        return this.userService.getUserWithProfile(id);
    }

    @Put(':id/profile')
    async updateUserProfile(@Param('id') id: number, @Body() profileDto: ProfileDto): Promise<Profile> {
        return this.userService.updateProfile(id, profileDto);
    }
}
