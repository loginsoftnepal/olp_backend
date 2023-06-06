import { HttpException, HttpStatus } from '@nestjs/common';

export class ConnectionRequestPendingException extends HttpException {
  constructor() {
    super('Connection Request pending', HttpStatus.BAD_REQUEST);
  }
}
