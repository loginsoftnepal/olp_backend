import { HttpException, HttpStatus } from '@nestjs/common';

export class ConnectionRequestAcceptedException extends HttpException {
  constructor() {
    super('Connection Request is accepted', HttpStatus.NOT_FOUND);
  }
}
