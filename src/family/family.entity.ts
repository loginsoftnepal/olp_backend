import User from 'src/users/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Entity,
} from 'typeorm';

@Entity()
export default class Family {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => User, (user) => user.family)
  public user: User;

  @Column()
  public familyType: string;

  @Column({ nullable: true })
  public noOfFamilyMember: string;

  @Column({ nullable: true })
  public noOfSiblings: string;

  @Column({ nullable: true })
  public noOfUnmarried: string;

  @Column({ nullable: true })
  public liveWithFamily: string;

  @Column({ nullable: true })
  public nativePlace: string;

  @Column({ nullable: true })
  public familyValues: string;

  @Column({ nullable: true })
  public gotra: string;

  @Column({ nullable: true })
  public parentStatus: string;

  @Column({ nullable: true })
  public familyAddress: string;

  @Column({ nullable: true })
  public motherTongue: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
