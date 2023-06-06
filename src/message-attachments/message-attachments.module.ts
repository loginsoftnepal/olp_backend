import { Module } from '@nestjs/common';
import { MessageAttachmentsService } from './message-attachments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageAttachment } from './message-attachments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageAttachment])],
  providers: [MessageAttachmentsService],
  exports: [MessageAttachmentsService],
})
export class MessageAttachmentsModule {}
