import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationController } from './confirmation.controller';
import { ConfirmationService } from './confirmation.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Profile } from '../../user/entities/profile.entity';

describe('ConfirmationController', () => {
  let controller: ConfirmationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmationController],
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

    controller = module.get<ConfirmationController>(ConfirmationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
