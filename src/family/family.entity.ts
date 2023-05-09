import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class Family {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public userId: string;

  @Column()
  public mobile: string;

  @Column()
  public familyType: string;

  @Column()
  public fatherOccupation: string;

  @Column()
  public motherOccupation: string;

  @Column()
  public noOfBrother: number;

  @Column()
  public noOfSister: number;

  @Column()
  public noOfFamilyMember: number;

  @Column()
  public noOfUnmarried: number;

  @Column()
  public municipality: string;

  @Column()
  public district: string;

  @Column()
  public province: string;

  @Column()
  public country: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
