import { Controller, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { Body, Post, Get } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BSON } from 'typeorm';
import { User } from './entites/user.entity';

@ApiBearerAuth('JWT-auth') 
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    @Post('register')
    createUser(@Body() regDto: RegisterDto){
        return this.authService.register(regDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    loginUser(@Body() loginDto: LoginDto){
        return this.authService.signIn(loginDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Body() profile: User){
        return this.authService.getProfile(profile);
    }
}
