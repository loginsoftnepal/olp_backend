import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Admin {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  public password: string;

  @Column({ unique: true })
  public email: string;

  @Column({ default: new Date(Date.now()) })
  public createdAt: Date;

  @Column({ nullable: true })
  public currentHashedRefreshToken: string;
}
