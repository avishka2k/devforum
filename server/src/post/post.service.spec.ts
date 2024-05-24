import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { User } from '../user/entities/user.entity';
import { BlogPost } from './entities/post.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
