import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { ResponseHelperService } from 'src/response-helper/response-helper.service';
import { RegisterDto } from './dtos/register.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private responseHelperService: ResponseHelperService,
        private jwtService: JwtService,
    ) {}

    async register(data: RegisterDto) {
        const userExists = await this.userRepository.findOne({ where: [
            { email: data.email }, 
            { username: data.username }
        ] });

        if(userExists) {
            throw new ForbiddenException('User already exists');
        }

        const hashpw = await argon2.hash(data.password);

        const newUser = this.userRepository.create({
            ...data,
            password: hashpw,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return this.responseHelperService.returnSuccess(await this.userRepository.save(newUser));
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
        return this.responseHelperService.returnSuccess(await this.userRepository.save(user));
    }

    async getProfile(userDetails: User) {
        const user = await this.userRepository.findOne({ where: { username: userDetails.username } });
        return this.responseHelperService.returnSuccess(user);
    }
}
