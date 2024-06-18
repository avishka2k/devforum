import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ProfileDto } from './dtos/profile.dto';
import { Profile } from './entities/profile.entity';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { VerificationService } from '../email/verification/verification.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly emailConfirmationService: VerificationService,
  ) {}

  @Post('register')
  async createUser(@Body() regDto: RegisterDto) {
    const user = await this.userService.register(regDto);
    await this.emailConfirmationService.sendVerificationLink(regDto.email);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginUser(@Body() loginDto: LoginDto) {
    return this.userService.signIn(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserWithProfile(@Param('id') id: number): Promise<User> {
    return this.userService.getUserWithProfile(id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/profile')
  async getUserProfile(@Param('id') id: number): Promise<Profile> {
    return this.userService.getProfile(id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Put(':id/profile')
  async updateUserProfile(
    @Param('id') id: number,
    @Body() profileDto: ProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Profile> {
    return this.userService.updateProfile(id, profileDto, file);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/follow/:followUserId')
  async followUser(
    @Param('id') id: number,
    @Param('followUserId') followUserId: number,
  ): Promise<void> {
    return this.userService.followUser(id, followUserId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/unfollow/:unfollowUserId')
  async unfollowUser(
    @Param('id') id: number,
    @Param('unfollowUserId') unfollowUserId: number,
  ): Promise<void> {
    return this.userService.unfollowUser(id, unfollowUserId);
  }
}
