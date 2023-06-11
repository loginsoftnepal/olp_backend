import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Banner from './banner.entity';
import { QueryRunner, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import User from 'src/users/user.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) {}

  async uploadUserBanner(file: any, queryRunner: QueryRunner, user: User) {
    const banner = queryRunner.manager.create(Banner, {
      fileName: file.filename,
      originalFileName: file.originalname,
      path: file.path,
      user,
    });
    console.log('we reached at banner');
    await queryRunner.manager.save(Banner, banner);
    return banner;
  }

  async deleteBannerWithQueryRunner(
    bannerId: string,
    queryRunner: QueryRunner,
  ) {
    const deleteResponse = await queryRunner.manager.delete(Banner, bannerId);
    console.log(deleteResponse);
    if (!deleteResponse.affected) {
      throw new NotFoundException();
    }
  }
}
