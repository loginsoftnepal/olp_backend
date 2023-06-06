import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from './connection.entity';
import { Repository } from 'typeorm';
import { DeleteConnectionRequestParams } from 'src/utils/types';
import { ConnectionNotFoundException } from './exception/connectionNotFound.exception';
import { DeleteConnectionException } from './exception/deleteConnection.exception';
import { ConnectionRequest } from 'src/connection-requests/connection-request.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
  ) {}

  async getConnections(id: string) {
    return this.connectionRepository.find({
      where: [{ sender: { id } }, { receiver: { id } }],
      relations: ['sender', 'receiver', 'sender.profile', 'receiver.profile'],
    });
  }

  async getConnectionsById(id: string) {
    return await this.connectionRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'sender.profile', 'receiver.profile'],
    });
  }

  async deleteConnection({ id, userId }: DeleteConnectionRequestParams) {
    const connection = await this.getConnectionsById(id);
    if (!connection) throw new ConnectionNotFoundException();

    if (connection.receiver.id !== userId && connection.sender.id !== userId) {
      throw new DeleteConnectionException();
    }

    await this.connectionRepository.delete(id);

    return connection;
  }

  async isConnection(userOneId: string, userTwoId: string) {
    return this.connectionRepository.findOne({
      where: [
        { sender: { id: userOneId }, receiver: { id: userTwoId } },
        { sender: { id: userTwoId }, receiver: { id: userOneId } },
      ],
    });
  }
}
