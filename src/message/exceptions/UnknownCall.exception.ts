import { HttpException, HttpStatus } from '@nestjs/common';

export class UnknownCallException extends HttpException {
  constructor() {
    super('User not available', HttpStatus.BAD_REQUEST);
  }
}
