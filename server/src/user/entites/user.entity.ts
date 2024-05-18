import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;
    @Column({ type: 'varchar', length: 255, unique: true })
    username: string;
    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;
    @Column({ type: 'varchar', length: 500})
    password: string;
    @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
    role: string;
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
    @Column({ type: 'datetime', nullable: true })
    lst_login: Date;
    @OneToOne(() => Profile, profile => profile.user)
    @JoinColumn()
    profile: Profile;
}