import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { ResponseHelperService } from 'src/response-helper/response-helper.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Profile } from 'src/profile/entites/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Profile]),
    JwtModule.register({
        global: true,
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ResponseHelperService]
})
export class AuthModule {}
