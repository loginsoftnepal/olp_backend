import User from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.notification)
  public user: User;

  @Column({ nullable: true })
  public type: string;

  @Column({ nullable: true })
  public heading: string;

  @Column({ nullable: true })
  public content: string;

  @ManyToOne(() => User)
  public relatedUser: User;

  @CreateDateColumn()
  public createdAt: string;
}
