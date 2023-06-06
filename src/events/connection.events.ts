import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SocketwayService } from 'src/socketway/socketway.service';
import {
  ConnectionRequestEventPayload,
  RemoveFriendEventPayload,
} from 'src/utils/types';

@Injectable()
export class ConnectionEvents {
  constructor(private readonly gateway: SocketwayService) {}

  @OnEvent('connection.removed')
  handleConnectionRemoved({ userId, connection }: RemoveFriendEventPayload) {
    const { sender, receiver } = connection;
    const socket = this.gateway.sessionManager.getUserSocket(
      receiver.id === userId ? sender.id : receiver.id,
    );
    console.log('onConnectionRemoved to be hit');
    socket?.emit('onConnectionRemoved', connection);
  }
}
