import { Exclude, Expose } from 'class-transformer';
import UserAvatar from 'src/user-avatar/user-avatar.entity';
import { Message } from 'src/message/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Profile from 'src/profile/profile.entity';
import Family from 'src/family/family.entity';
import Preferance from 'src/preferance/preferance.entity';
import EducationEntity from 'src/education/education.entity';
import { Peer } from 'src/peer/peer.entity';
import Photos from 'src/photos/photos.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  public username: string;

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => UserAvatar, {
    nullable: true,
  })
  public avatar?: UserAvatar;

  @Column({ nullable: true })
  public avatarId?: string;

  @Column({ nullable: true })
  @Exclude()
  public password: string;

  @Column({ unique: true })
  public email: string;

  @Column({ default: false })
  public profilestatus: boolean;

  @Column({ nullable: true })
  public currentHashedRefreshToken: string;

  @Column({ default: false })
  public isGoogleAuth: boolean;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: ['remove'],
  })
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => Family, (family) => family.user)
  @JoinColumn()
  family: Family;

  @OneToOne(() => Preferance, (preferance) => preferance.user)
  @JoinColumn()
  preferance: Preferance;

  @OneToOne(() => EducationEntity, (education) => education.user)
  @JoinColumn()
  education: EducationEntity;

  @OneToOne(() => Peer, (peer) => peer.user, {
    cascade: ['insert', 'remove', 'update'],
  })
  @JoinColumn()
  peer: Peer;

  @OneToMany(() => Photos, (photos) => photos.user)
  @JoinColumn()
  photos: Photos[];

  @OneToMany(() => Message, (message) => message.author)
  @JoinColumn()
  messages: Message[];
}

export default User;
