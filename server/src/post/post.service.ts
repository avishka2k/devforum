import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/post.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PosDto } from './dtos/post.dto';
import * as AWS from 'aws-sdk';
import { Tag } from './entities/tag.entity';
import { TagDto } from './dtos/tag.dto';
import * as cron from 'node-cron';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(BlogPost) private postRepository: Repository<BlogPost>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.schedulePostPublication();
  }

  schedulePostPublication() {
    cron.schedule('* * * * *', () => {
      this.publishPosts();
    });
  }

  async publishPosts() {
    const now = new Date();
    const postsToPublish = await this.postRepository.find({
      where: {
        publish_at: LessThanOrEqual(now),
        is_published: false,
      },
    });

    for (const post of postsToPublish) {
      post.is_published = true;
      await this.postRepository.save(post);
    }
  }

  private readonly s3 = new AWS.S3({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  });

  async findAll(): Promise<BlogPost[]> {
    const posts = await this.postRepository.find({
      relations: ['user', 'user.profile', 'tags'],
    });

    if (!posts || posts.length === 0) {
      throw new NotFoundException('Posts not found');
    }

    posts.forEach((p) => {
      delete p.user.password;
    });

    return posts;
  }

  async findAllByUser(userId: number): Promise<BlogPost[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const posts = await this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'tags'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!posts || posts.length === 0) {
      throw new NotFoundException('Posts not found');
    }
    return posts;
  }

  async findByPost(postId: number): Promise<BlogPost> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'tags'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createPost(userId: number, postDto: PosDto, file: Express.Multer.File) {
    let today = new Date();
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      const tags = await Promise.all(
        postDto.tags.map(
          (name) =>
            this.tagRepository.findOne({ where: { name } }) ||
            this.tagRepository.save({ name }),
        ),
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!file || !file.originalname) {
        throw new BadRequestException('Please upload a cover photo');
      }

      let publishdate = new Date(postDto.publish_at);
      const nameFormat = Date.now() + '_' + file.originalname;
      const isPublished = postDto.is_published === 'true';
      const res = await this.uploadFile(file, nameFormat);
      const part = res.Location.split('/');
      const imagename = `${process.env.DO_SPACES_CDN_ENDPOINT}/${process.env.DO_SPACES_BUCKET_COVERS}/${part[part.length - 1]}`;

      const post = this.postRepository.create({
        ...postDto,
        user,
        image: imagename,
        created_at: new Date(),
        tags,
        is_published: false,
      });

      if (isPublished === true) {
        post.publish_at = publishdate;
        if (publishdate < today) {
          throw new BadRequestException(
            'Invalid publish date! Plase select a future date.',
          );
        }
      } else {
        post.publish_at = new Date();
      }

      await this.postRepository.save(post);

      return { message: 'Post created successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updatePost(postId: number, postDto: PosDto, file: Express.Multer.File) {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const tags = await Promise.all(
      postDto.tags.map(
        (name) =>
          this.tagRepository.findOne({ where: { name } }) ||
          this.tagRepository.save({ name }),
      ),
    );

    if (file) {
      const nameFormat = Date.now() + '_' + file.originalname;
      const res = await this.uploadFile(file, nameFormat);
      const part = res.Location.split('/');
      const imagename = `${process.env.DO_SPACES_CDN_ENDPOINT}/${process.env.DO_SPACES_BUCKET_COVERS}/${part[part.length - 1]}`;
      post.image = imagename;
    }

    post.title = postDto.title;
    post.content = postDto.content;
    post.tags = tags;

    await this.postRepository.save(post);

    return post;
  }

  // This method uploads a file to AWS S3
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

  async findAllTags(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async createTag(tagDto: TagDto): Promise<Tag> {
    const tag = this.tagRepository.create({
      ...tagDto,
    });

    return await this.tagRepository.save(tag);
  }

  async deletePost(postId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.delete(postId);

    return { message: 'Post deleted successfully' };
  }
}
