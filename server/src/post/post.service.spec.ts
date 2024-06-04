import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../user/dtos/login.dto';
import { User } from '../user/entities/user.entity';
import { Profile } from '../user/entities/profile.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from '../user/dtos/register.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let profileRepository: Repository<Profile>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    profileRepository = module.get<Repository<Profile>>(getRepositoryToken(Profile));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        fullname: 'Test User',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(argon2, 'hash').mockResolvedValue('hashedpassword');
      jest.spyOn(userRepository, 'create').mockReturnValue(registerDto as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue(registerDto as any);
      jest.spyOn(profileRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(profileRepository, 'save').mockResolvedValue({} as any);

      const result = await service.register(registerDto);

      expect(result).toEqual({ message: 'User registered successfully!' });
    });

    it('should throw a ForbiddenException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        fullname: 'Test User',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(registerDto as any);

      await expect(service.register(registerDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('markEmailAsConfirmed', () => {
    it('should mark email as confirmed', async () => {
      jest.spyOn(userRepository, 'update').mockResolvedValue({} as any);
      const result = await service.markEmailAsConfirmed('test@example.com');
      expect(result).toEqual({});
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const user = { email: 'test@example.com' };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);
      const result = await service.getByEmail('test@example.com');
      expect(result).toEqual(user);
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return an access token', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password123' };
      const user = { id: 1, username: 'testuser', password: 'hashedpassword' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
      jest.spyOn(service, 'updateLastLogin').mockResolvedValue({ user } as any);

      const result = await service.signIn(loginDto);

      expect(result).toEqual({ access_token: 'token' });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password123' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.signIn(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = { username: 'testuser', password: 'password123' };
      const user = { id: 1, username: 'testuser', password: 'hashedpassword' };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);

      await expect(service.signIn(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateLastLogin', () => {
    it('should update the last login date of the user', async () => {
      const user = { id: 1, lst_login: new Date() };
      jest.spyOn(userRepository, 'save').mockResolvedValue(user as any);
      const result = await service.updateLastLogin(user as any);
      expect(result).toEqual({ user });
    });
  });

  describe('getUserWithProfile', () => {
    it('should return a user with profile by id', async () => {
      const user = { id: 1, profile: {} };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);
      const result = await service.getUserWithProfile(1);
      expect(result).toEqual(user);
    });
  });

  describe('getProfile', () => {
    it('should return a profile by id', async () => {
      const profile = { id: 1 };
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(profile as any);
      const result = await service.getProfile(1);
      expect(result).toEqual(profile);
    });
  });

  describe('updateProfile', () => {
    it('should update a user profile', async () => {
      const user = { id: 1, profile: {} };
      const profileData = { fullname: 'Updated Name' };
      const updatedProfileData = { ...profileData, updated_at: new Date() };
  
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(profileRepository, 'save').mockResolvedValue(updatedProfileData as any);
  
      const result = await service.updateProfile(1, profileData);
      expect(result).toMatchObject(profileData);
    });
  
    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.updateProfile(1, {})).rejects.toThrow(NotFoundException);
    });
  });
  

describe('followUser', () => {
  it('should allow a user to follow another user', async () => {
    const user = { id: 1, following: [] };
    const followUser = { id: 2 };

    jest.spyOn(userRepository, 'findOne')
      .mockResolvedValueOnce(user as any)
      .mockResolvedValueOnce(followUser as any);
    jest.spyOn(userRepository, 'save').mockResolvedValue({} as any);

    await service.followUser(1, 2);

    expect(user.following).toContain(followUser);
  });

  it('should throw a NotFoundException if user or followUser is not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.followUser(1, 2)).rejects.toThrow(NotFoundException);
  });
});


  describe('unfollowUser', () => {
    it('should allow a user to unfollow another user', async () => {
      const user = { id: 1, following: [{ id: 2 }] };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(userRepository, 'save').mockResolvedValue({} as any);

      await service.unfollowUser(1, 2);

      expect(user.following).not.toContain({ id: 2 });
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.unfollowUser(1, 2)).rejects.toThrow(NotFoundException);
    });
  });
});
