import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ForgetPassword {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  forgetPasswordToken: string;

  @Column()
  forgetPasswordExpire: Date;
}
