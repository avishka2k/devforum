import {
  Body,
  Controller,
  Get,
  Next,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PosDto } from './dtos/post.dto';
import { BlogPost } from './entities/post.entity';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { NextFunction } from 'express';

@ApiBearerAuth('JWT-auth')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findAllByUser(@Param('id') id: number) {
    return this.postService.findAllByUser(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  createPost(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() postDto: PosDto,
  ) {
    return this.postService.createPost(id, postDto, file);
  }

  @UseGuards(AuthGuard)
  @Put(':postId')
  updatePost(
    @Param('postId') postId: number,
    @Body() postDto: PosDto,
  ): Promise<BlogPost> {
    return this.postService.updatePost(postId, postDto);
  }
}
