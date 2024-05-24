import {
     Controller,
     ClassSerializerInterceptor,
     UseInterceptors,
     Post,
     Body,
     Get,
     Query,
   } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';

@Controller('confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class ConfirmationController {
     constructor(
          private readonly emailConfirmationService: ConfirmationService
     ) {}

     @Get('confirm')
     async confirmGet(@Query('token') token: string) {
          const email = await this.emailConfirmationService.decodeConfirmationToken(token);
          await this.emailConfirmationService.confirmEmail(email);
          return { message: 'Email successfully verified' };
     }
}