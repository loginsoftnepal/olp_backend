import { Transform } from 'class-transformer';
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
export default class EducationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user) => user.education)
  public user: User;

  @Column()
  public education_degree: string;

  @Column({ nullable: true })
  public subject: string;

  @Column()
  public college: string;

  @Column()
  public occupation: string;

  @Column({ nullable: true })
  public annualIncome: string;

  @Column({ nullable: true })
  public sector: string;

  @Column({ nullable: true })
  public companyName: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
