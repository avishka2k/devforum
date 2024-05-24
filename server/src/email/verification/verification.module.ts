import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { ConfigService } from '@nestjs/config';
import EmailService from '../email.service';

@Module({
  controllers: [VerificationController],
  providers: [
    VerificationService,
    ConfigService,
    EmailService
  ]
})
export class VerificationModule {}
