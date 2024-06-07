import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PostDto } from './dtos/post.dto';
import { BlogPost } from './entities/post.entity';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { TagDto } from './dtos/tag.dto';

@ApiTags('posts')
@ApiBearerAuth('JWT-auth')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('tags')
  findAllTags() {
    return this.postService.findAllTags();
  }

  @UseGuards(AuthGuard)
  @Get(':userId/byuser')
  findAllByUser(@Param('userId') id: number) {
    return this.postService.findAllByUser(id);
  }

  @UseGuards(AuthGuard)
  @Get(':postId/bypost')
  findByPost(@Param('postId') postId: number) {
    return this.postService.findByPost(postId);
  }

  @UseGuards(AuthGuard)
  @Post('tags')
  createTag(@Body() tagDto: TagDto) {
    return this.postService.createTag(tagDto);
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  createPost(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() postDto: PostDto,
  ) {
    return this.postService.createPost(id, postDto, file);
  }

  @UseGuards(AuthGuard)
  @Put(':postId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  updatePost(
    @Param('postId') postId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() postDto: PostDto,
  ): Promise<BlogPost> {
    return this.postService.updatePost(postId, postDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':postId')
  deletePost(@Param('postId') postId: number) {
    return this.postService.deletePost(postId);
  }
}
