import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import * as argon2 from 'argon2';
import * as AWS from 'aws-sdk';
import { LoginDto } from './dtos/login.dto';
import { ProfileDto } from './dtos/profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  private readonly s3 = new AWS.S3({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  async register(data: RegisterDto) {
    const userExists = await this.userRepository.findOne({
      where: [{ email: data.email }, { username: data.username }],
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
    return { message: 'User registered successfully!' };
  }

  async markEmailAsConfirmed(email: string) {
    return this.userRepository.update(
      { email },
      {
        isEmailConfirmed: true,
      },
    );
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async signIn(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { username: data.username },
    });

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
    return { user: update };
  }

  async getUserWithProfile(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    delete user.password;
    return user;
  }

  async getProfile(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
    });
    return profile;
  }

  async updateProfile(
    userId: number,
    profileData: ProfileDto,
    file: Express.Multer.File,
  ): Promise<Profile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = user.profile;
    profile.updated_at = new Date();
    if (file?.originalname) {
      await this.deleteFile(profile);
      const nameFormat = Date.now() + '_' + file.originalname;
      const res = await this.uploadFile(file, nameFormat);
      const part = res.Location.split('/');
      const imagename = `${process.env.DO_SPACES_CDN_ENDPOINT}/${process.env.DO_SPACES_BUCKET_AVATAR}/${part[part.length - 1]}`;

      profile.avatar = imagename;
    }

    Object.assign(profile, profileData);
    delete user.password;
    await this.profileRepository.save(profile);
    return profile;
  }

  async followUser(userId: number, followUserId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    const followUser = await this.userRepository.findOne({
      where: { id: followUserId },
    });
    if (!user || !followUser) {
      throw new NotFoundException('User not found');
    }

    user.following.push(followUser);
    await this.userRepository.save(user);
  }

  async unfollowUser(userId: number, unfollowUserId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.following = user.following.filter(
      (followingUser) => followingUser.id !== unfollowUserId,
    );
    await this.userRepository.save(user);
  }

  // This method uploads a file to AWS S3
  async uploadFile(file: Express.Multer.File, filename: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: `${process.env.DO_SPACES_BUCKET_AVATAR}/${filename}`,
        Body: file.buffer,
        ACL: 'public-read',
      })
      .promise();

    return uploadResult;
  }

  // This method delete a file to AWS S3
  async deleteFile(profile: Profile) {
    if (profile.avatar) {
      const params = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: `${process.env.DO_SPACES_BUCKET_AVATAR}/${profile.avatar.split('/').pop()}`,
      };
      this.s3.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }
  }
}
