import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogPost]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
