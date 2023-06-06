import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidConversationException extends HttpException {
  constructor() {
    super('Invalid Conversation id', HttpStatus.BAD_REQUEST);
  }
}
