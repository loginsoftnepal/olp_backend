import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { CreateMessageDto } from './dto/createMessage.dto';
import { Attachment } from 'src/utils/types';
import { EmptyMessageException } from './exceptions/EmptyMessageException';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EditMessageDto } from './dto/updateMessage.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { diskStorage } from 'multer';
import { CreateCallDto } from './dto/createCall.dto';
import { UnknownCallException } from './exceptions/UnknownCall.exception';

@Controller('message')
@UseGuards(JwtAuthenticationGuard)
@ApiTags('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'attachments',
          maxCount: 5,
        },
      ],
      {
        storage: diskStorage({
          destination: './uploadedFiles/attachments',
        }),
      },
    ),
  )
  @ApiConsumes('multipart/form-data')
  async createMessage(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>,
    @Body() { message }: CreateMessageDto,
  ) {
    console.log(files);
    if (!files.attachments && !message) {
      throw new EmptyMessageException();
    }

    const params = {
      user: request.user,
      id,
      message,
      attachments: files.attachments,
    };
    const response = await this.messageService.createMessage(params);
    this.eventEmitter.emit('message.create', response);
    return response;
  }

  // @Post(':id')
  // @UseGuards(JwtAuthenticationGuard)
  // @UseInterceptors(
  //   FileFieldsInterceptor([{ name: 'attachments', maxCount: 20 }], {
  //     // storage: diskStorage({
  //     //   destination: './uploadedFiles/attachments',
  //     // }),
  //   }),
  // )
  // async createMessage(
  //   @UploadedFiles() files: Record<string, Express.Multer.File[]>,
  // ) {
  //   console.log(files);
  // }

  @Post('/call/:id')
  @UseGuards(JwtAuthenticationGuard)
  async createCall(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
    @Body() { type, status }: CreateCallDto,
  ) {
    if (type !== 'video' && type !== 'audio') {
      throw new UnknownCallException();
    }

    if (status !== 'onVideoCallInitiate' && status !== 'onAudioCallInitiate') {
      throw new UnknownCallException();
    }

    const params = {
      user: request.user,
      id: id,
      type: type,
      status: status,
    };

    const response = await this.messageService.createCall(params);
  }

  @Get(':id')
  async getMessagesFromConversation(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ) {
    const messages = await this.messageService.getMessages(id);
    return { id, messages };
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @Req() request: RequestWithUser,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { userId: request.user.id, conversationId, messageId };
    await this.messageService.deleteMessage(params);
    this.eventEmitter.emit('message.delete', params);
    return { conversationId, messageId };
  }

  @Patch(':messageId')
  async editMessage(
    @Req() request: RequestWithUser,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
    @Body() { message }: EditMessageDto,
  ) {
    const params = {
      userId: request.user.id,
      conversationId,
      messageId,
      message,
    };
    const updatedMessage = await this.messageService.editMessage(params);
    this.eventEmitter.emit('message.update', updatedMessage);
    return updatedMessage;
  }
}
