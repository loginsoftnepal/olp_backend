import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Profile {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public userId: string;

  @Column()
  public fullname: string;

  @Column()
  public age: number;

  @Column()
  public height: number;

  @Column()
  public sex: string;

  @Column()
  public religion: string;

  @Column()
  public caste: string;

  @Column()
  public subcaste: string;

  @Column({ nullable: true })
  public gotra: string;

  @Column()
  public language: string;

  @Column()
  public marital_status: string;

  @Column({ type: Date })
  public dateOfBirth: Date;

  @Column()
  public smokeOrdrink: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
