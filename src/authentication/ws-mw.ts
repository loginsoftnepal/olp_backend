import { Socket } from 'socket.io';
import { WsAuthGuard } from './ws-auth.guard';
import { AuthenticatedSocket } from 'src/utils/interfaces';

export type SocketAuthMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};
export const SocketIOMiddleware = (): SocketAuthMiddleware => {
  return (client: AuthenticatedSocket, next) => {
    try {
      const payload = WsAuthGuard.validateToken(client);
      client.user = payload as { userId: string };
      next();
    } catch (error) {
      next(error);
    }
  };
};
