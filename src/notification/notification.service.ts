import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Notification from './notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationParams } from 'src/utils/types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(params: CreateNotificationParams) {
    const { user, heading, content, type, relatedUser } = params;
    // console.log(params);
    const newNotification = this.notificationRepository.create(params);
    // console.log(newNotification);
    return await this.notificationRepository.save(newNotification);
  }

  async delete(userId: string, notificationId: string) {
    console.log(userId, notificationId);
    const targetNotification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user: { id: userId },
      },
    });
    if (!targetNotification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }
    const deleteResponse = await this.notificationRepository.delete(
      targetNotification.id,
    );
    if (!deleteResponse.affected) {
      throw new HttpException(
        'Cannot delete notification',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getById(notificationId: string) {
    return await this.notificationRepository.findOne({
      where: { id: notificationId },
    });
  }

  async getNotificationOfUser(id: string, page: number, limit: number) {
    const notification = await this.notificationRepository.find({
      where: { user: { id: id } },
      relations: ['relatedUser'],
      skip: page * limit,
      take: limit,
    });
    return notification;
  }
}
