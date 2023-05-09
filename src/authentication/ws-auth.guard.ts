import {
  CanActivate,
  ExecutionContext,
  Logger,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsAuthGuard extends AuthGuard('ws-jwt') implements CanActivate {
  logger = new Logger('WsAuthGuard');

  canActivate(context: ExecutionContext) {
    this.getRequest(context);
    return true;
  }

  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake;
  }
}
