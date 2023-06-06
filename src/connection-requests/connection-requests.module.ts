import { Module } from '@nestjs/common';
import { ConnectionRequestsController } from './connection-requests.controller';
import { ConnectionRequestsService } from './connection-requests.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionRequest } from './connection-request.entity';
import { ConnectionModule } from 'src/connection/connection.module';
import { UsersModule } from 'src/users/users.module';
import { Connection } from 'src/connection/connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConnectionRequest, Connection]),
    ConnectionModule,
    UsersModule,
  ],
  controllers: [ConnectionRequestsController],
  providers: [ConnectionRequestsService],
  exports: [ConnectionRequestsService],
})
export class ConnectionRequestsModule {}
