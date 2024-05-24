import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { JwtService } from '@nestjs/jwt';
import { PostService } from './post.service';
import { User } from '../user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/post.entity';

describe('PostController', () => {
  let controller: PostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        JwtService, 
        PostService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlogPost),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
