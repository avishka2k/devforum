import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import EmailService from '../email.service';

@Module({
  controllers: [VerificationController],
  providers: [
    VerificationService,
    EmailService
  ]
})
export class VerificationModule {}
