import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PosDto } from './dtos/post.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(BlogPost) private postRepository: Repository<BlogPost>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private readonly s3 = new AWS.S3({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  async findAll(): Promise<BlogPost[]> {
    return await this.postRepository.find();
  }

  async findAllByUser(userId: number): Promise<BlogPost[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const posts = await this.postRepository.find({
      where: { user: { id: userId } },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!posts || posts.length === 0) {
      throw new NotFoundException('Posts not found');
    }
    return posts;
  }

  async createPost(userId: number, postDto: PosDto, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const nameFormat = Date.now() + '_' + file.originalname;
    const res = await this.uploadFile(file, nameFormat);
    const part = res.Location.split('/');
    const imagename = `${process.env.DO_SPACES_CDN_ENDPOINT}/${process.env.DO_SPACES_BUCKET_COVERS}/${part[part.length - 1]}`;

    const post = this.postRepository.create({
      ...postDto,
      user,
      image: imagename,
      created_at: new Date(),
    });
    post.created_at = new Date();
    await this.postRepository.save(post);
    
    return { message: 'Post created successfully'};
  }

  async updatePost(id: number, postDto: PosDto): Promise<BlogPost> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.updated_at = new Date();
    await this.postRepository.update({ id }, postDto);

    delete post.user.password;
    return post;
  }

  async uploadFile(file: Express.Multer.File, filename: string) {
    
    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: `${process.env.DO_SPACES_BUCKET_COVERS}/${filename}`,
        Body: file.buffer,
        ACL: 'public-read',
      })
      .promise();

    return uploadResult;
  }
  
}
