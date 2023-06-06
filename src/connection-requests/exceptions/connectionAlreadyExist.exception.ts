import { HttpException, HttpStatus } from '@nestjs/common';

export class ConnectionAlreadyExistException extends HttpException {
  constructor() {
    super('Connection Already Exist', HttpStatus.BAD_REQUEST);
  }
}
