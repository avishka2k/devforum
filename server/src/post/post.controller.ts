import {
  Body,
  Controller,
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
import { PosDto } from './dtos/post.dto';
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

  @Get(':id')
  findAllByUser(@Param('id') id: number) {
    return this.postService.findAllByUser(id);
  }

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
