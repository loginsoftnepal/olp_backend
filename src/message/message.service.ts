import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import {
  CreateCallParams,
  CreateMessageParams,
  DeleteMessageParams,
  EditMessageParams,
} from 'src/utils/types';
import { ConversationsService } from 'src/conversations/conversations.service';
import { ConversationNotFoundException } from 'src/conversations/exceptions/ConversationNotFound.exception';
import { ConnectionService } from 'src/connection/connection.service';
import { CannotCreateMessageException } from './exceptions/cannotCreateMessage.exception';
import { instanceToPlain } from 'class-transformer';
import { CannotDeleteMessageException } from './exceptions/cannotDeleteMessage.exception';
import { Conversation } from 'src/conversations/conversation.entity';
import { MessageAttachmentsService } from 'src/message-attachments/message-attachments.service';
import { CallService } from 'src/call/call.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly conversationService: ConversationsService,
    private readonly connectionService: ConnectionService,
    private readonly messageAttachmentService: MessageAttachmentsService,
    private readonly callService: CallService,
  ) {}
  async createMessage(params: CreateMessageParams) {
    const { user, message, attachments, id } = params;
    const conversation = await this.conversationService.findById(id);
    if (!conversation) throw new ConversationNotFoundException();
    const { creator, recepient } = conversation;
    const isConnected = await this.connectionService.isConnection(
      creator.id,
      recepient.id,
    );
    if (!isConnected) throw new ConversationNotFoundException();
    if (creator.id !== user.id && recepient.id !== user.id) {
      throw new CannotCreateMessageException();
    }
    const newMessage = this.messageRepository.create({
      content: message,
      conversation,
      author: instanceToPlain(user),
      attachments: attachments
        ? await this.messageAttachmentService.create(attachments)
        : [],
    });
    const savedMessage = await this.messageRepository.save(newMessage);
    conversation.lastMessageSent = savedMessage;
    const updated = await this.conversationService.save(conversation);
    return { message: savedMessage, conversation: updated };
  }

  getMessages(conversationId: string, page: number, limit: number) {
    return this.messageRepository.find({
      relations: ['author', 'attachments', 'call', 'conversation'],
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
      skip: page * limit,
      take: limit,
    });
  }

  async createCall(params: CreateCallParams) {
    const { user, type, status, id } = params;

    const conversation = await this.conversationService.findById(id);
    if (!conversation) throw new ConversationNotFoundException();
    const { creator, recepient } = conversation;
    const isConnected = await this.connectionService.isConnection(
      creator.id,
      recepient.id,
    );
    if (!isConnected) throw new ConversationNotFoundException();

    if (creator.id !== user.id && recepient.id !== user.id) {
      throw new CannotCreateMessageException();
    }

    const newCall = await this.callService.create({ type, status });
    const newMessage = this.messageRepository.create({
      conversation,
      author: instanceToPlain(user),
      call: newCall,
    });

    const savedMessage = await this.messageRepository.save(newMessage);
    conversation.lastMessageSent = savedMessage;
    const updated = await this.conversationService.save(conversation);
    return { message: savedMessage, conversation: updated, call: newCall };
  }

  async deleteMessage(params: DeleteMessageParams) {
    const { conversationId, messageId, userId } = params;
    const msgParams = { id: conversationId, limit: 5 };
    const conversation = await this.conversationService.getMessage(msgParams);
    if (!conversation) throw new ConversationNotFoundException();
    const message = await this.messageRepository.findOne({
      where: {
        id: messageId,
        author: { id: userId },
        conversation: { id: conversationId },
      },
    });
    if (!message) throw new CannotDeleteMessageException();
    if (conversation.lastMessageSent.id !== message.id) {
      return this.messageRepository.delete({ id: message.id });
    }
    return this.deleteLastMessage(conversation, message);
  }

  async deleteLastMessage(conversation: Conversation, message: Message) {
    const size = conversation.messages.length;
    if (size <= 1) {
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: null,
      });
      return this.messageRepository.delete({ id: message.id });
    } else {
      const newLastMessage = conversation.messages[1];
      await this.conversationService.update({
        id: conversation.id,
        lastMessageSent: newLastMessage,
      });
      return this.messageRepository.delete({ id: message.id });
    }
  }

  async editMessage(params: EditMessageParams) {
    const messages = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
      },
      relations: [
        'conversation',
        'conversation.creator',
        'conversation.recipient',
        'author',
        'author.profile',
      ],
    });
    if (!messages) {
      throw new HttpException('Cannot edit Message', HttpStatus.BAD_REQUEST);
    }
    messages.content = params.message;
    return this.messageRepository.save(messages);
  }
}
