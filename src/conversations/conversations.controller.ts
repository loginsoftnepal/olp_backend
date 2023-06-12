import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateConversationDto } from './dto/createConversation.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('conversations')
@UseGuards(JwtAuthenticationGuard)
@ApiTags('conversation')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly events: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @Body() createConversationPayload: CreateConversationDto,
    @Req() request: RequestWithUser,
  ) {
    console.log('creating conversation');
    const conversation = await this.conversationsService.createConversation(
      request.user,
      createConversationPayload,
    );
    this.events.emit('conversation.create', conversation);
    console.log(conversation);
    return conversation;
  }

  @Get()
  async getConversations(@Req() request: RequestWithUser) {
    return this.conversationsService.getConversations(request.user.id);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: string) {
    return this.conversationsService.findById(id);
  }
}
