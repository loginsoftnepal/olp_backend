import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection } from './connection.entity';
import { Repository } from 'typeorm';
import { DeleteConnectionRequestParams } from 'src/utils/types';
import { ConnectionNotFoundException } from './exception/connectionNotFound.exception';
import { DeleteConnectionException } from './exception/deleteConnection.exception';
import { ConnectionRequest } from 'src/connection-requests/connection-request.entity';
import { ConnectionRequestsService } from 'src/connection-requests/connection-requests.service';

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

  async deleteConnectionOfUser(userId: string) {
    const deleteResponse = await this.connectionRepository
      .createQueryBuilder('connection')
      .leftJoinAndSelect('connection.sender', 'sender')
      .leftJoinAndSelect('conneciton.receiver', 'receiver')
      .delete()
      .from(Connection)
      .where('sender.id = :id', { id: userId })
      .orWhere('receiver.id = :id', { id: userId })
      .execute();

    if (!deleteResponse.affected) {
      throw new HttpException(
        'No connections of users found',
        HttpStatus.NOT_FOUND,
      );
    }
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
