import { Injectable } from '@nestjs/common';
import User from 'src/users/user.entity';
import { CreateConversationDto } from './dto/createConversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './conversation.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import {
  AccessParams,
  CreateConversationParams,
  GetConversationMessagesParams,
  UpdateConversationParams,
} from 'src/utils/types';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound.exception';
import { CreateconversationException } from './exceptions/CreateConversation.exception';
import { ConnectionService } from 'src/connection/connection.service';
import { ConnectionNotFoundException } from 'src/connection/exception/connectionNotFound.exception';
import { ConversationExistsException } from './exceptions/ConversationExists.exception';
import { Message } from 'src/message/message.entity';
import { ConversationNotFoundException } from './exceptions/ConversationNotFound.exception';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UsersService,
    private readonly connectionService: ConnectionService,
  ) {}

  async getConversations(id: string) {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recepient', 'recepient')
      .where('creator.id = :id', { id })
      .orWhere('recepient.id = :id', { id })
      .orderBy('conversation.lastMessageSentAt', 'DESC')
      .getMany();
  }

  async findById(id: string) {
    return this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'recepient', 'lastMessageSent'],
    });
  }

  async isCreated(userId: string, recepientId: string) {
    return this.conversationRepository.findOne({
      where: [
        {
          creator: { id: userId },
          recepient: { id: recepientId },
        },
        {
          creator: { id: recepientId },
          recepient: { id: userId },
        },
      ],
    });
  }

  async createConversation(creator: User, params: CreateConversationParams) {
    const { userId, message } = params;
    const recepient = await this.userService.getById(userId);
    if (!recepient) throw new UserNotFoundException();
    if (creator.id === recepient.id) {
      throw new CreateconversationException(
        'Cannot create conversation with youself',
      );
    }

    const isConnected = await this.connectionService.isConnection(
      creator.id,
      userId,
    );
    if (!isConnected) throw new ConnectionNotFoundException();
    const exists = await this.isCreated(creator.id, recepient.id);
    if (exists) throw new ConversationExistsException();
    const newConversation = this.conversationRepository.create({
      creator,
      recepient,
    });
    const conversation = await this.conversationRepository.save(
      newConversation,
    );
    const newMessage = this.messageRepository.create({
      content: message,
      conversation,
      author: creator,
    });
    await this.messageRepository.save(newMessage);
    return conversation;
  }

  async hasAccess({ id, userId }: AccessParams) {
    const conversation = await this.findById(id);
    if (!conversation) throw new ConversationNotFoundException();
    return (
      conversation.creator.id === userId || conversation.recepient.id === userId
    );
  }

  async save(conversation: Conversation) {
    return this.conversationRepository.save(conversation);
  }

  getMessage({ id, limit }: GetConversationMessagesParams) {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('id = :id', { id })
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id = :id', { id })
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getOne();
  }

  update({ id, lastMessageSent }: UpdateConversationParams) {
    return this.conversationRepository.update(id, { lastMessageSent });
  }
}
