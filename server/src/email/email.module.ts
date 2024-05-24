import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import  EmailService  from './email.service';
import { VerificationModule } from './verification/verification.module';
import { ConfirmationModule } from './confirmation/confirmation.module';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
  imports: [
    VerificationModule, 
    ConfirmationModule
  ]
})
export class EmailModule {}

