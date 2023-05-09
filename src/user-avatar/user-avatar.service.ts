import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserAvatar from './user-avatar.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserAvatarService {
  constructor(
    @InjectRepository(UserAvatar)
    private userAvatarRepository: Repository<UserAvatar>,
  ) {}

  async uploadUserAvatar(
    dataBuffer: Buffer,
    filename: string,
    queryRunner: QueryRunner,
  ) {
    const newFile = await queryRunner.manager.create(UserAvatar, {
      filename,
      data: dataBuffer,
    });
    await queryRunner.manager.save(UserAvatar, newFile);
    return newFile;
  }

  async deleteFileWithQueryRunner(fileId: string, queryRunner: QueryRunner) {
    const deleteResponse = await queryRunner.manager.delete(UserAvatar, fileId);
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }

  async getFileById(fileId: string) {
    const file = await this.userAvatarRepository.findOne({
      where: { id: fileId },
    });
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}
