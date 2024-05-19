import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PosDto } from './dtos/post.dto';
import { BlogPost } from './entities/post.entity';

@ApiBearerAuth('JWT-auth') 
@Controller('post')
export class PostController {
     constructor(
          private readonly postService: PostService,
     ) {}

     @Get()
     findAll() {
          return this.postService.findAll();
     }

     @Post(':id/')
     createPost(@Param('id') id: number, @Body() postDto: PosDto): Promise<BlogPost> {
          return this.postService.createPost(id, postDto);
     }
}
