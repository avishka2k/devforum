import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Profile } from "./profile.entity";

@Entity({ name: 'social_accounts' })
export class SocialLink {
  @PrimaryGeneratedColumn({ type: 'bigint'})
  id: number;

  @Column({nullable: true})
  url: string;

  @ManyToOne(() => Profile, (profile) => profile.socialLinks)
  profile: Profile;
}