import { Tag } from "./tag";
import { User } from "./user";

export type Post = {
     id: number;
     title: string;
     content: string;
     image: string;
     is_published: boolean;
     publish_at: Date;
     created_at: Date;
     updated_at: Date;
     user: User;
     tags: Tag[];
}