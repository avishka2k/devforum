import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogPost]),
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
