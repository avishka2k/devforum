import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToOne, 
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'profiles' })
export class Profile {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column({nullable: true})
    fullname: string;

    @Column({nullable: true})
    avatar: string;

    @Column({nullable: true})
    headline: string;

    @Column({nullable: true})
    bio: string;

    @Column({nullable: true})
    location: string;

    @Column({nullable: true})
    website: string;

    @Column({nullable: true})
    link1: string;

    @Column({nullable: true})
    link2: string;

    @Column({nullable: true})
    link3: string;

    @Column({nullable: true})
    link4: string;

    @Column({nullable: true})
    updated_at: Date;

    @OneToOne(() => User, user => user.profile)
    user: User;
}