import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from './entities/post.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PostDto } from './dtos/post.dto';
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

    posts.forEach((p) => {
      delete p.user.password;
    });

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

    delete post.user.password;

    return post;
  }

  async createPost(
    userId: number,
    postDto: PostDto,
    file: Express.Multer.File,
  ) {
    let today = new Date();
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      const tags = await Promise.all(
        postDto.tags.map(async (name) => {
          const tag = await this.tagRepository.findOne({ where: { name } });
          if (tag) {
            return tag;
          } else {
            return this.tagRepository.save({ name });
          }
        }),
      );

      if (!file?.originalname) {
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

  async updatePost(postId: number, postDto: PostDto, file: any): Promise<any> {
    try {
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const tags = await Promise.all(
        postDto.tags.map(async (name) => {
          const tag = await this.tagRepository.findOne({ where: { name } });
          if (tag) {
            return tag;
          } else {
            return this.tagRepository.save({ name });
          }
        }),
      );

      if (file?.originalname) {
        await this.deleteFile(post);
        const nameFormat = Date.now() + '_' + file.originalname;
        const res = await this.uploadFile(file, nameFormat);
        const part = res.Location.split('/');
        const imagename = `${process.env.DO_SPACES_CDN_ENDPOINT}/${process.env.DO_SPACES_BUCKET_COVERS}/${part[part.length - 1]}`;

        post.image = imagename;
      }

      let publishdate = new Date(postDto.publish_at);
      const isPublished = postDto.is_published === 'true';
      post.tags = tags;
      post.is_published = false;
      post.title = postDto.title;
      post.content = postDto.content;
      post.updated_at = new Date();

      if (isPublished === true) {
        if (publishdate < new Date()) {
          throw new BadRequestException(
            'Invalid publish date! Please select a future date.',
          );
        }
        post.publish_at = publishdate;
      }

      await this.postRepository.save(post);

      return { message: 'Post updated successfully' };
    } catch (error) {
      console.log(error);
      throw error;
    }
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
    await this.deleteFile(post);

    return { message: 'Post deleted successfully' };
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

  // This method delete a file to AWS S3
  async deleteFile(post: BlogPost) {
    const params = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: `${process.env.DO_SPACES_BUCKET_COVERS}/${post.image.split('/').pop()}`,
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
