import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageAttachmentsModule } from './message-attachments.module';
import { MessageAttachment } from './message-attachments.entity';
import { Repository } from 'typeorm';
import { Attachment } from 'src/utils/types';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessageAttachmentsService {
  constructor(
    @InjectRepository(MessageAttachment)
    private readonly attachmentRepository: Repository<MessageAttachment>,
  ) {}

  async create(attachments: Attachment[]) {
    const promise = attachments.map(async (attachment) => {
      const fileName = uuidv4() + extname(attachment.originalname);

      const newAttachment = this.attachmentRepository.create({
        fileName,
        originalFileName: attachment.originalname,
        path: attachment.path,
      });
      return this.attachmentRepository.save(newAttachment);
    });

    return Promise.all(promise);
  }
}
