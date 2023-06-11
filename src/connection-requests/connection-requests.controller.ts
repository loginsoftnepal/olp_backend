import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConnectionRequestsService } from './connection-requests.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { CreateConnectionRequestDto } from './dto/createFriendRequest.dto';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

@Controller('connection-requests')
@ApiTags('connection-requests')
export class ConnectionRequestsController {
  constructor(
    private readonly connectionRequestService: ConnectionRequestsService,
    private event: EventEmitter2,
  ) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getConnectionRequests(@Req() request: RequestWithUser) {
    console.log('fetching connection request');
    return this.connectionRequestService.getConnectionRequests(request.user.id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createConnectionRequest(
    @Req() request: RequestWithUser,
    @Body() payload: CreateConnectionRequestDto,
  ) {
    console.log('conneciton request');
    const params = { user: request.user, userId: payload.userId };
    console.log(params.userId);
    const connectionRequest = await this.connectionRequestService.create(
      params,
    );
    this.event.emit('connection-request.create', connectionRequest);
    return connectionRequest;
  }

  @Patch(':id/accept')
  @UseGuards(JwtAuthenticationGuard)
  async acceptConnectionRequest(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ) {
    const response = await this.connectionRequestService.accept({
      id,
      userId: request.user.id,
    });
    this.event.emit('connection-request.accepted', response);
    return response;
  }

  @Delete(':id/cancel')
  @UseGuards(JwtAuthenticationGuard)
  async cancelConnectionRequest(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ) {
    const response = await this.connectionRequestService.cancel({
      id,
      userId: request.user.id,
    });
    this.event.emit('connection-request.cancel', response);
    return response;
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthenticationGuard)
  async rejectConnectionRequest(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ) {
    const response = await this.connectionRequestService.reject({
      id,
      userId: request.user.id,
    });
    this.event.emit('connection-request.reject', response);
    return response;
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard)
  async deleteConnectionRequest(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ) {
    const {
      user: { id: userId },
    } = request;

    const connection = await this.connectionRequestService.delete({
      id,
      userId,
    });
    this.event.emit('connection.removed', { connection, userId });
    return connection;
  }
}
