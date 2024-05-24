import { Module } from '@nestjs/common';
import { ConfirmationController } from './confirmation.controller';
import { ConfirmationService } from './confirmation.service';
import { UserService } from '../../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/entities/user.entity';
import { Profile } from '../../user/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [ConfirmationController],
  providers: [ConfirmationService, UserService]
})
export class ConfirmationModule {}
