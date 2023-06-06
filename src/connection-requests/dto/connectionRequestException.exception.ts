import { HttpException, HttpStatus } from '@nestjs/common';

export class ConnectionRequestException extends HttpException {
  constructor() {
    super('Connection request exception', HttpStatus.NOT_FOUND);
  }
}
