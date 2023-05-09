import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Photos {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public userId: number;

  @Column()
  public picture1: string;

  @Column()
  public picture2: string;

  @Column()
  public picture3: string;

  @Column()
  public picture4: string;

  @Column()
  public picture5: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
