import { User } from 'src/auth/entites/user.entity';
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToOne, 
    JoinColumn 
} from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column({nullable: true})
    fullname: string;

    @Column({nullable: true})
    avatar: string;

    @Column({nullable: true})
    bio: string;

    @Column({nullable: true})
    location: string;

    @Column({nullable: true})
    website: string;

    @Column({nullable: true})
    updated_at: Date;

    @OneToOne(() => User, user => user.id)
    @JoinColumn()
    user: User;
}