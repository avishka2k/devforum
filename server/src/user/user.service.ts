import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from './entites/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entites/profile.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import * as argon2 from 'argon2';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        private jwtService: JwtService,
    ) {}

    async register(data: RegisterDto) {
        const userExists = await this.userRepository.findOne({
            where: [
                { email: data.email },
                { username: data.username }
            ]
        });

        if (userExists) {
            throw new ForbiddenException('User already exists');
        }

        const hashpw = await argon2.hash(data.password);

        const newUser = this.userRepository.create({
            ...data,
            password: hashpw,
            created_at: new Date(),
        });

        await this.userRepository.save(newUser);

        const newProfile = this.profileRepository.create({
            id: newUser.id,
            fullname: data.fullname,
        });

        newProfile.user = newUser;
        delete newUser.password;
        await this.profileRepository.save(newProfile);
        return {user: newUser};
    }

    async signIn(data: LoginDto): Promise<{ access_token: string }> {
        const user = await this.userRepository.findOne({ where: { username: data.username } });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        const passwordMatch = await argon2.verify(user.password, data.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Password is incorrect');
        }
        const payload = { sub: user.id, username: user.username };
        await this.updateLastLogin(user);
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async updateLastLogin(user: User) {
        user.lst_login = new Date();
        const update = await this.userRepository.save(user);
        return {user: update};
    }

    async getUserWithProfile(id: number): Promise<User> {

        const user = await this.userRepository.findOne({    
            where: { id },
            relations: ['profile'],
        });
        delete user.password;
        return user;
    }

    async updateProfile(userId: number, profileData: Partial<Profile>): Promise<Profile> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['profile'],
        });
        
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        const profile = user.profile;
        Object.assign(profile, profileData);
        delete user.password;
        await this.profileRepository.save(profile);
        return profile;
      }

      async followUser(userId: number, followUserId: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });
        const followUser = await this.userRepository.findOne({ where: { id: followUserId } });
        if (!user || !followUser) {
          throw new NotFoundException('User not found');
        }
    
        user.following.push(followUser);
        await this.userRepository.save(user);
      }
    
      async unfollowUser(userId: number, unfollowUserId: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['following'] });
        if (!user) {
          throw new NotFoundException('User not found');
        }
    
        user.following = user.following.filter(followingUser => followingUser.id !== unfollowUserId);
        await this.userRepository.save(user);
      }

}
