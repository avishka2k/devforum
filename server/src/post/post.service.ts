import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { PosDto } from './dtos/post.dto';

@Injectable()
export class PostService {
     constructor(
          @InjectRepository(BlogPost) private postRepository: Repository<BlogPost>,
          @InjectRepository(User) private userRepository: Repository<User>,
     ) {}

     async findAll(): Promise<BlogPost[]> {
          return await this.postRepository.find();
     }

     async createPost(userId: number, postDto: PosDto): Promise<BlogPost> {
          const user = await this.userRepository.findOne({ where: { id: userId } });

          if (!user) {
               throw new NotFoundException('User not found');
          }
          const post = this.postRepository.create({
               ...postDto,
               user,
               created_at: new Date(),
           });
           delete user.password;
          return await this.postRepository.save(post);
     }
}
