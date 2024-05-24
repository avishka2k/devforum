import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationService } from './confirmation.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Profile } from '../../user/entities/profile.entity';

describe('ConfirmationService', () => {
  let service: ConfirmationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmationService, 
        JwtService, 
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        }
      ],
    }).compile();

    service = module.get<ConfirmationService>(ConfirmationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
