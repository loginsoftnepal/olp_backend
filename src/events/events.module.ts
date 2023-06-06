import { Module } from '@nestjs/common';
import { ConnectionRequestEvent } from './connection-requests.events';
import { ConnectionEvents } from './connection.events';
import { SocketwayModule } from 'src/socketway/socketway.module';

@Module({
  imports: [SocketwayModule],
  providers: [ConnectionRequestEvent, ConnectionEvents],
})
export class EventsModule {}
