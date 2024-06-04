import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/entities/user.entity';
import { BlogPost } from './entities/post.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { PostModule } from './post.module';

describe('PostModule', () => {
  let pmodule: PostModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostModule,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BlogPost),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tag),
          useClass: Repository,
        },
      ],
    }).compile();

    pmodule = module.get<PostModule>(PostModule);
  });

  it('should be defined', () => {
    expect(pmodule).toBeDefined();
  });
});
