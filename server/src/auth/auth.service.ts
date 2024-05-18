import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { Profile } from 'src/profile/entites/profile.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        private jwtService: JwtService,
    ) { }

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

        await this.profileRepository.save(newProfile);

        delete newUser.password;

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
        return this.userRepository.findOne({
            where: { id },
            relations: ['profile'],
          });
    }
}
