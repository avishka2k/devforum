import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import EmailService from '../email.service';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import handlebars from "handlebars";
import * as fs from "fs";
 
@Injectable()
export class VerificationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
 
  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.EMAIL_TOKEN_EXPIRATION_TIME
    });
 
    const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;

    const emailTemplate = fs.readFileSync("src/email/templates/verification.hbs", "utf-8")
    const template = handlebars.compile(emailTemplate)

    const html = (template({
     url: url,
     email: email
    }));
 
    return this.emailService.sendMail({
      to: email,
      subject: 'Sign up for DevForum - Email Verification',
      html
    })
  }
}