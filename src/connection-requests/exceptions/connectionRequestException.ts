import { HttpException, HttpStatus } from '@nestjs/common';

export class ConnectionRequestException extends HttpException {
  constructor(msg?: string) {
    const defaultMsg = 'Connection Request Exception';

    super(msg ? `${defaultMsg} + :${msg}` : defaultMsg, HttpStatus.BAD_REQUEST);
  }
}
