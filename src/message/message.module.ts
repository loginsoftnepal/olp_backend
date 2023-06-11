import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { ConnectionModule } from 'src/connection/connection.module';
import { MessageAttachmentsModule } from 'src/message-attachments/message-attachments.module';
import { CallModule } from 'src/call/call.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ConversationsModule,
    ConnectionModule,
    MessageAttachmentsModule,
    CallModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
