import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PosDto } from './dtos/post.dto';
import { BlogPost } from './entities/post.entity';
import { AuthGuard } from 'src/auth/auth.guard';

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
  createPost(
    @Param('id') id: number,
    @Body() postDto: PosDto,
  ): Promise<BlogPost> {
    return this.postService.createPost(id, postDto);
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
