import { Module } from '@nestjs/common';
import { SocketwayService } from './socketway.service';
import { SocketwaySessionManager } from './socketwaysession.service';
import { SessionManagerModule } from 'src/session-manager/session-manager.module';
import { UsersModule } from 'src/users/users.module';
import { ConnectionModule } from 'src/connection/connection.module';
import { ConversationsModule } from 'src/conversations/conversations.module';

@Module({
  imports: [
    SessionManagerModule,
    UsersModule,
    ConnectionModule,
    ConversationsModule,
  ],
  providers: [SocketwayService],
  exports: [SocketwayService],
})
export class SocketwayModule {}
