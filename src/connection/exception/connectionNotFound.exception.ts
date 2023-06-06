import { HttpException, HttpStatus } from '@nestjs/common';

export class ConnectionNotFoundException extends HttpException {
  constructor() {
    super('Connection not found', HttpStatus.NOT_FOUND);
  }
}
