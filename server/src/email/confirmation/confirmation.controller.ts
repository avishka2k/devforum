import {
     Controller,
     ClassSerializerInterceptor,
     UseInterceptors,
     Get,
     Query,
     Res,
   } from '@nestjs/common';
import { ConfirmationService } from './confirmation.service';
import { Response } from 'express';
import handlebars from "handlebars";
import * as fs from "fs";

@Controller('confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class ConfirmationController {
     constructor(
          private readonly emailConfirmationService: ConfirmationService
     ) {}

     @Get('confirm')
     async confirmGet(@Query('token') token: string, @Res() res: Response) {
          const email = await this.emailConfirmationService.decodeConfirmationToken(token);
          await this.emailConfirmationService.confirmEmail(email);
          // return { message: 'Email successfully verified' };
          res.redirect('/confirmation/success');
     }

     @Get('success')
     async getSuccess() {
          const emailTemplate = fs.readFileSync("src/email/templates/verificationSuccess.hbs", "utf-8")
          const template = handlebars.compile(emailTemplate)
          const html = (template({
               url: process.env.EMAIL_CALLBACK_URL,
               message: 'Email Verification'
          }));
          return html;
     }
}