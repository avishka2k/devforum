import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { VerificationService } from 'src/email/verification/verification.service';
import { ConfigService } from '@nestjs/config';
import EmailService from 'src/email/email.service';
config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
    JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService, 
    VerificationService, 
    ConfigService, 
    EmailService
  ]
})
export class UserModule {}
