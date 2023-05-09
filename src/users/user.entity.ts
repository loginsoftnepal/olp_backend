import { Exclude, Expose } from 'class-transformer';
import UserAvatar from 'src/user-avatar/user-avatar.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}

export default User;
