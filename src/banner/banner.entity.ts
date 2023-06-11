import User from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Banner {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  fileName: string;

  @Column({ nullable: true })
  originalFileName: string;

  @Column({ nullable: true })
  path: string;

  @OneToOne(() => User, (user) => user.banner)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
