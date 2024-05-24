import { Module } from '@nestjs/common';
import { ConfirmationController } from './confirmation.controller';
import { ConfirmationService } from './confirmation.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Profile } from 'src/user/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [ConfirmationController],
  providers: [ConfirmationService, ConfigService, UserService]
})
export class ConfirmationModule {}
