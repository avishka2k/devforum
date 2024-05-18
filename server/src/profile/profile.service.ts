import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entites/profile.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dtos/user.dto';
import { User } from 'src/auth/entites/user.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(User) private userRepository: Repository<User>,
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

        await this.userRepository.save(profile.user);
        await this.profileRepository.save(profile);

        delete profile.user.password;

        return {profile: profile};
    }

    async getProfile(id: number) {
        const profile = await this.profileRepository.findOne({ where: { id: id }, relations: ['user'] });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        if (!profile.user) {
            throw new NotFoundException('User not found');
        }

        delete profile.user.password;
        
        return {profile: profile}
    }
}
