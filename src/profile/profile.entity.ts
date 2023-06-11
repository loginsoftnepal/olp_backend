import User from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Profile {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user) => user.profile)
  public user: User;

  @Column()
  public fullname: string;

  @Column()
  public height: string;

  @Column()
  public sex: string;

  @Column()
  public religion: string;

  @Column({ nullable: true })
  public caste: string;

  @Column({ nullable: true })
  public subcaste: string;

  @Column({ nullable: true })
  public profileCreatedFor: string;

  @Column()
  public marital_status: string;

  @Column({ nullable: true })
  public day: string;

  @Column({ nullable: true })
  public month: string;

  @Column({ nullable: true })
  public year: string;

  @Column({ nullable: true })
  public address: string;

  @Column({ nullable: true })
  public physicalDisability: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
