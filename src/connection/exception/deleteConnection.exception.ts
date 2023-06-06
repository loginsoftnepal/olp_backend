import { HttpException, HttpStatus } from '@nestjs/common';

export class DeleteConnectionException extends HttpException {
  constructor() {
    super('Cannot delete the connection', HttpStatus.BAD_REQUEST);
  }
}
