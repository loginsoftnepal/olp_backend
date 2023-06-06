import { HttpException, HttpStatus } from '@nestjs/common';

export class ConnectionRequestNotFoundException extends HttpException {
  constructor() {
    super('Connection not found', HttpStatus.NOT_FOUND);
  }
}
