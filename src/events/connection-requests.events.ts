import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConnectionRequest } from 'src/connection-requests/connection-request.entity';
import { SocketwayService } from 'src/socketway/socketway.service';
import {
  AcceptConnectionRequestResponse,
  ConnectionRequestEventPayload,
} from 'src/utils/types';

@Injectable()
export class ConnectionRequestEvent {
  constructor(private readonly gateway: SocketwayService) {}

  @OnEvent('connection-request.create')
  connectionRequestCreate(payload: ConnectionRequest) {
    const receiverSocket = this.gateway.sessionManager.getUserSocket(
      payload.receiver.id,
    );
    console.log('onConnectionRequestReceived to be hit');
    receiverSocket &&
      receiverSocket.emit('onConnectionRequestReceived', payload);
  }

  @OnEvent('connection-request.cancel')
  handleConnectionRequestCancel(payload: ConnectionRequest) {
    const receiverSocket = this.gateway.sessionManager.getUserSocket(
      payload.receiver.id,
    );
    console.log('onConnectionRequestCancelled to be hit');
    receiverSocket &&
      receiverSocket.emit('onConnectionRequestCancelled', payload);
  }

  @OnEvent('connection-request.accept')
  handleConnectionRequestAccepted(payload: AcceptConnectionRequestResponse) {
    const senderSocket = this.gateway.sessionManager.getUserSocket(
      payload.connectionRequest.sender.id,
    );
    console.log('onConnectionRequestAccepted to be hit');
    senderSocket && senderSocket.emit('onConnectionRequestAccepted', payload);
  }

  @OnEvent('connection-request.reject')
  handleConnectionRequestRejected(payload: ConnectionRequest) {
    const senderSocket = this.gateway.sessionManager.getUserSocket(
      payload.sender.id,
    );
    console.log('onConnecitonRequest to be hit');
    senderSocket.emit('onConnectionRequestR', {});
    console.log(senderSocket && senderSocket.id);
    senderSocket && senderSocket.emit('onConnectionRequestRejected', payload);
  }
}
