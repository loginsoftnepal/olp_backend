import { Call } from 'src/call/call.entity';
import { Conversation } from 'src/conversations/conversation.entity';
import { MessageAttachment } from 'src/message-attachments/message-attachments.entity';
import User from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({ nullable: true })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.messages)
  author: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @OneToOne(() => Call, (call) => call.message)
  @JoinColumn()
  call: Call;

  @OneToMany(
    () => MessageAttachment,
    (message_attachments) => message_attachments.message,
  )
  attachments: MessageAttachment[];
}
