import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class EducationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public userId: string;

  @Column()
  public education_degree: string;

  @Column()
  public subject: string;

  @Column()
  public college: string;

  @Column()
  public occupation: string;

  @Column()
  public job: boolean;

  @Column()
  public selfEmployed: boolean;

  @Column()
  public monthlySalary: number;

  @Column()
  public annualIncone: number;

  @Column({ nullable: true })
  public companyName: string;

  @Column()
  public foreignEmployment: boolean;

  @Column()
  public country: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
