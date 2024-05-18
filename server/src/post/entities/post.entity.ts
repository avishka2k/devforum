import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}