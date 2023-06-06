import User from 'src/users/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Preferance {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => User, (user) => user.preferance)
  public user: User;

  @Column({ nullable: true })
  public minAge: string;

  @Column({ nullable: true })
  public maxAge: string;

  @Column()
  public maritalStatus: string;

  @Column({ nullable: true })
  public minHeight: string;

  @Column({ nullable: true })
  public maxHeight: string;

  @Column({ nullable: true })
  public sector: string;

  @Column({ nullable: true })
  public religion: string;

  @Column({ nullable: true })
  public caste: string;

  @Column({ nullable: true })
  public subcaste: string;

  @Column({ nullable: true })
  public motherTongue: string;

  @Column({ nullable: true })
  public education: string;

  @Column({ nullable: true })
  public subject: string;

  @Column({ nullable: true })
  public occupation: string;

  @Column({ nullable: true })
  public annualIncome: string;
}
