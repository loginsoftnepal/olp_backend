import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

@Controller('connection')
@UseGuards(JwtAuthenticationGuard)
@ApiTags('connection')
export class ConnectionController {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly event: EventEmitter2,
  ) {}

  @Get()
  async getConnections(@Req() request: RequestWithUser) {
    return await this.connectionService.getConnections(request.user.id);
  }

  @Delete(':id/delete')
  async deleteConnection(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ) {
    const {
      user: { id: userId },
    } = request;
    const connection = await this.connectionService.deleteConnection({
      id,
      userId,
    });
    this.event.emit('connection.removed', { connection, userId });
    return connection;
  }
}
