import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class UserAvatar {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}

export default UserAvatar;
