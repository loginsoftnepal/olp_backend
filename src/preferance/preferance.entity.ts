import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Preferance {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public userId: string;

  @Column()
  public minAge: number;

  @Column()
  public maxAge: number;

  @Column()
  public maritalStatus: string;

  @Column({ nullable: true })
  public height: number;

  @Column()
  public religion: string;

  @Column({ nullable: true })
  public caste: string;

  @Column({ nullable: true })
  public subcaste: string;

  @Column()
  public language: string;

  @Column()
  public education: string;

  @Column()
  public occupation: string;

  @Column()
  public country: string;

  @Column({ nullable: true })
  public smokeOrDrink: string;
}
