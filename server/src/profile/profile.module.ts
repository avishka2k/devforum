import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entites/profile.entity';
import { User } from 'src/auth/entites/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
