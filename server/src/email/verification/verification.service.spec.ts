import { Test, TestingModule } from '@nestjs/testing';
import { VerificationService } from './verification.service';
import { JwtService } from '@nestjs/jwt';
import EmailService from '../email.service';

describe('VerificationService', () => {
  let service: VerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        JwtService,
        EmailService
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
