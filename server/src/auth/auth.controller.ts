import { Controller, HttpCode, HttpStatus, Param, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { Body, Post, Get } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
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

    @Get(':id')
  async getUserWithProfile(@Param('id') id: number): Promise<User> {
    return this.authService.getUserWithProfile(id);
  }
}
