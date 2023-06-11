import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionRequest } from './connection-request.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ConnectionService } from 'src/connection/connection.service';
import {
  CancelConnectionRequestParams,
  ConnectionRequestParams,
  CreateConnectionParams,
  DeleteConnectionRequestParams,
} from 'src/utils/types';
import { ConnectionRequestNotFoundException } from './dto/connectionRequestNotFound.exception';
import { ConnectionRequestException } from './dto/connectionRequestException.exception';
import { UserNotFoundException } from 'src/users/exceptions/UserNotFound.exception';
import { ConnectionRequestPendingException } from './exceptions/connectionRequestPending.exception';
import { ConnectionAlreadyExistException } from './exceptions/connectionAlreadyExist.exception';
import { ConnectionRequestAcceptedException } from './exceptions/connectionRequestAcceptedException';
import { Connection } from 'src/connection/connection.entity';

@Injectable()
export class ConnectionRequestsService {
  constructor(
    @InjectRepository(ConnectionRequest)
    private readonly connectionRequestRepository: Repository<ConnectionRequest>,

    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    private readonly userService: UsersService,
    private readonly connectionService: ConnectionService,
  ) {}

  async getConnectionRequests(id: string) {
    const status = 'pending';
    return this.connectionRequestRepository.find({
      where: [
        { sender: { id }, status },
        { receiver: { id }, status },
      ],
      relations: ['receiver', 'sender', 'receiver.profile', 'sender.profile'],
    });
  }

  async findById(id: string) {
    return this.connectionRequestRepository.findOne({
      where: { id },
      relations: ['receiver', 'sender'],
    });
  }

  async cancel({ id, userId }: CancelConnectionRequestParams) {
    const connectionRequest = await this.findById(id);
    if (!connectionRequest) throw new ConnectionRequestNotFoundException();
    if (connectionRequest.sender.id !== userId)
      throw new ConnectionRequestException();
    await this.connectionRequestRepository.delete(id);
    return connectionRequest;
  }

  async create({ user: sender, userId: receiverId }: CreateConnectionParams) {
    const receiver = await this.userService.getById(receiverId);
    console.log(sender);
    if (!receiver) throw new UserNotFoundException();
    const exists = await this.isPending(sender.id, receiver.id);
    if (exists) throw new ConnectionRequestPendingException();
    if (receiver.id == sender.id) {
      throw new ConnectionRequestException();
    }

    const isConnected = await this.connectionService.isConnection(
      sender.id,
      receiver.id,
    );

    if (isConnected) throw new ConnectionAlreadyExistException();
    const connectionRequest = this.connectionRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });
    console.log('requst created');
    return this.connectionRequestRepository.save(connectionRequest);
  }

  async accept({ id, userId }: ConnectionRequestParams) {
    const connectionRequest = await this.findById(id);
    if (!connectionRequest) throw new ConnectionRequestNotFoundException();
    if (connectionRequest.status === 'accepted') {
      throw new ConnectionRequestAcceptedException();
    }

    if (connectionRequest.receiver.id !== userId) {
      throw new ConnectionRequestException();
    }
    connectionRequest.status = 'accepted';
    const updatedConnectionRequest =
      await this.connectionRequestRepository.save(connectionRequest);
    const newRequest = this.connectionRepository.create({
      sender: connectionRequest.sender,
      receiver: connectionRequest.receiver,
    });

    const connection = await this.connectionRepository.save(newRequest);
    return { connection, connectionRequest: updatedConnectionRequest };
  }

  async reject({ id, userId }: CancelConnectionRequestParams) {
    const connectionRequest = await this.findById(id);
    if (!connectionRequest) throw new ConnectionRequestNotFoundException();

    if (connectionRequest.status === 'accepted') {
      throw new ConnectionRequestAcceptedException();
    }

    if (connectionRequest.receiver.id !== userId) {
      throw new ConnectionRequestException();
    }

    connectionRequest.status = 'rejected';
    return this.connectionRequestRepository.save(connectionRequest);
  }

  async delete({ id, userId }: DeleteConnectionRequestParams) {
    const connection = await this.connectionService.deleteConnection({
      id,
      userId,
    });
    console.log(connection);
    const connectionRequest = await this.connectionRequestRepository.findOne({
      where: [
        {
          sender: { id: connection.sender.id },
          receiver: { id: connection.receiver.id },
        },
      ],
    });

    const deleteResponse = await this.connectionRequestRepository.delete(
      connectionRequest.id,
    );
    if (!deleteResponse.affected) {
      throw new HttpException('failed to disconnect', HttpStatus.BAD_REQUEST);
    }
    return connection;
  }

  async isPending(userOneId: string, userTwoId: string) {
    return this.connectionRequestRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
          status: 'pending',
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
          status: 'pending',
        },
      ],
    });
  }
}
