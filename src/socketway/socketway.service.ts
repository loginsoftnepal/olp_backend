import { HttpException, Inject, Injectable, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { WsAuthGuard } from 'src/authentication/ws-auth.guard';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { Server, Socket } from 'socket.io';
import { SocketwaySessionManager } from './socketwaysession.service';
import { SessionManagerService } from 'src/session-manager/session-manager.service';
import { SocketwayAdapter } from './sockerway.adapter';
import { SocketIOMiddleware } from 'src/authentication/ws-mw';
import { UsersService } from 'src/users/users.service';
import { ConnectionService } from 'src/connection/connection.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateMessageResponse } from 'src/utils/types';
import { Conversation } from 'src/conversations/conversation.entity';
import { ConversationsService } from 'src/conversations/conversations.service';

@WebSocketGateway({
  cors: {
    origin: ['https://soft-croquembouche-7986b0.netlify.app'],
    credentials: true,
  },
})
@UseGuards(WsAuthGuard)
@Injectable()
export class SocketwayService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly userService: UsersService,
    readonly sessionManager: SessionManagerService,
    private readonly connectionService: ConnectionService,
    private readonly conversationService: ConversationsService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    console.log('hello world');
    client.use(SocketIOMiddleware() as any);
    console.log('afterInit');
  }

  async handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    const user = await this.userService.getById(socket.user.userId);
    if (!user) throw new WsException('User is not registered');
    this.sessionManager.setUserSocket(socket.user.userId, socket);
    console.log(`${user.username} connected`);
    socket.emit('connected', {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('handle Disconnect');
    console.log(`${socket.user.userId} disconnected`);
    this.sessionManager.removeUserSocket(socket.user.userId);
  }

  @SubscribeMessage('message')
  handleCreateMessage(socket: Socket, payload: any) {
    socket.emit('handleMessage', 'Hello world');
    console.log(payload);
  }

  // @SubscribeMessage('onConversationJoin')
  // onConversationJoin(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: AuthenticatedSocket,
  // ) {
  //   client.join(`conversation-${data.conversationId}`);
  //   client.to(`conversation-${data.conversationId}`).emit('userJoin');
  // }

  // @SubscribeMessage('onConversationLeave')
  // onConversationLeave(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: AuthenticatedSocket,
  // ) {
  //   client.leave(`conversation-${data.conversationId}`);
  //   client.to(`conversation-${data.conversationId}`).emit('userLeave');
  // }

  @SubscribeMessage('onTypingStart')
  onTypingStart(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onTypingStart');
    console.log(client.rooms);
    client.to(`conversation=${data.roomId}`).emit('onTypingStart');
  }

  @SubscribeMessage('onTypingStop')
  onTypingStop(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log('onTypingStop');
    client.to(`conversation-${data.roomId}`).emit('onTypingStop');
  }

  @SubscribeMessage('getConnectionOnline')
  async handleConnectionListRetrieve(
    @MessageBody() data: any,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { user } = client;
    if (user) {
      console.log('user is authenticated');
      console.log(`fetching ${user.userId}'s friends`);
      const connections = await this.connectionService.getConnections(
        user.userId,
      );
      const onlineConnections = connections.filter((connection) =>
        this.sessionManager.getUserSocket(
          user.userId === connection.sender.id
            ? connection.receiver.id
            : connection.sender.id,
        ),
      );
      client.emit('getConnectionOnline', onlineConnections);
    }
  }

  @OnEvent('message.create')
  handleMessageCreateEvent(payload: CreateMessageResponse) {
    const {
      author,
      conversation: { creator, recepient },
    } = payload.message;

    const authorSocket = this.sessionManager.getUserSocket(author.id);

    const recepientSocket =
      author.id == creator.id
        ? this.sessionManager.getUserSocket(recepient.id)
        : this.sessionManager.getUserSocket(creator.id);

    if (authorSocket) authorSocket.emit('onMessage', payload);
    if (recepientSocket) recepientSocket.emit('onMessage', payload);
  }

  @OnEvent('conversation.create')
  handleConversationCreate(payload: Conversation) {
    const recepientSocket = this.sessionManager.getUserSocket(
      payload.recepient.id,
    );

    if (recepientSocket) recepientSocket.emit('onConversation', payload);
  }

  @OnEvent('message.delete')
  async handleMessageDelete(payload) {
    const conversation = await this.conversationService.findById(
      payload.conversationId,
    );
    if (!conversation) return;
    const { creator, recepient } = conversation;
    const recepientSocket =
      creator.id === payload.userId
        ? this.sessionManager.getUserSocket(recepient.id)
        : this.sessionManager.getUserSocket(creator.id);
    if (recepientSocket) recepientSocket.emit('onMessageDelete', payload);
  }

  @SubscribeMessage('onVideoCallInitiate')
  async handleVideoCall(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('onVideoCallInitiate');
    const user = await this.userService.getById(socket.user.userId);
    const caller = user;
    console.log(caller);
    const receiverSocket = this.sessionManager.getUserSocket(data.recepientId);
    if (!receiverSocket) socket.emit('onUserUnavailable');
    receiverSocket && receiverSocket.emit('onVideoCall', { ...data, caller });
  }

  @SubscribeMessage('onVideoCallAccept')
  async handleVideoCallAccepted(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('onVideoCallAccept');
    console.log(data);
    const callerSocket = this.sessionManager.getUserSocket(data.caller.id);
    const conversation = await this.conversationService.isCreated(
      data.caller.id,
      socket.user.userId,
    );

    if (!conversation) return console.log('No conversation found');
    const user = await this.userService.getById(socket.user.userId);
    if (callerSocket) {
      const payload = { ...data, conversation, acceptor: user };
      callerSocket.emit('onVideoCallAccept', payload);
      socket.emit('onVideoCallAccept', payload);
    }
  }

  @SubscribeMessage('onVideoCallRejected')
  async handleVideoCallRejected(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('onVideoCall Reject');
    const receiver = socket.user;
    const callerSocket = this.sessionManager.getUserSocket(data.caller.id);
    callerSocket && callerSocket.emit('onVideoCallRejected', { receiver });
    socket.emit('onVideoCallRejected', { receiver });
  }

  @SubscribeMessage('onVideoCallHangUp')
  async handleVideoCallHangUp(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    if (socket.user.userId === data.caller.id) {
      const receiverSocket = this.sessionManager.getUserSocket(
        data.receiver.id,
      );
      socket.emit('onVideoCallHangUp');
      return receiverSocket && receiverSocket.emit('onVideoCallHangUp');
    }

    socket.emit('onVideoCallHangUp');
    const callerSocket = this.sessionManager.getUserSocket(data.caller.id);
    callerSocket && callerSocket.emit('onVideoCallHangUp');
  }

  @SubscribeMessage('onVoiceCallInitiate')
  async handleVoiceCallInitiate(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const user = await this.userService.getById(socket.user.userId);
    const caller = user;
    const receiverSocket = this.sessionManager.getUserSocket(data.recepientId);
    if (!receiverSocket) socket.emit('onUserUnavailable');
    receiverSocket.emit('onVoiceCall', { ...data, caller });
  }

  @SubscribeMessage('onVoiceCallAccept')
  async handleVoiceCallAccepted(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    console.log('onVoiceCallAccept');
    const callerSocket = this.sessionManager.getUserSocket(data.caller.id);
    const conversation = await this.conversationService.isCreated(
      data.caller.id,
      socket.user.userId,
    );

    if (!conversation) return console.log('No conversation found');
    const user = await this.userService.getById(socket.user.userId);
    if (callerSocket) {
      const payload = { ...data, conversation, acceptor: user };
      callerSocket.emit('onVoiceCallAccept', payload);
      socket.emit('onVoiceCallAccept', payload);
    }
  }

  @SubscribeMessage('onVoiceCallRejected')
  async handleVoiceCallRejected(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    const receiver = socket.user;
    const callerSocket = this.sessionManager.getUserSocket(data.caller.id);
    callerSocket && callerSocket.emit('onVoiceCallRejected', { receiver });
    socket.emit('onVoiceCallRejected', { receiver });
  }

  @SubscribeMessage('onVoiceCallHangUp')
  async handleVoiceCallHangUp(
    @MessageBody() data: any,
    @ConnectedSocket() socket: AuthenticatedSocket,
  ) {
    if (socket.user.userId === data.caller.id) {
      const receiverSocket = this.sessionManager.getUserSocket(
        data.receiver.id,
      );
      socket.emit('onVoiceCallHangUp');
      return receiverSocket && receiverSocket.emit('onVoiceCallHangUp');
    }

    socket.emit('onVoiceCallHangUp');
    const callerSocket = this.sessionManager.getUserSocket(data.caller.id);
    callerSocket && callerSocket.emit('onVoiceCallHangUp');
  }
}
