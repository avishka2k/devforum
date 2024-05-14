import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entites/profile.entity';
import { ResponseHelperService } from 'src/response-helper/response-helper.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { User } from 'src/auth/entites/user.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private responseHelperService: ResponseHelperService,
        private jwtService: JwtService,
    ) {}

    async updateProfile(data: UserDto) {
        const profile = await this.profileRepository.findOne({ where: { id: data.id }, relations: ['user'] });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        if (!profile.user) {
            throw new NotFoundException('User not found');
        }

        profile.updated_at = new Date();
        profile.bio = data.bio;
        profile.avatar = data.avatar;
        profile.location = data.location;
        profile.website = data.website;
        profile.user.fullname = data.fullname;

        await this.userRepository.save(profile.user);
        await this.profileRepository.save(profile);

        return this.responseHelperService.returnSuccess(profile);
    }

    // async getProfile(profile: Profile) {
    //     return this.responseHelperService.returnSuccess(await this.profileRepository.findOne({ where: { id: profile.id } }));
    // }
}
