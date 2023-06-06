import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Photos from './photos.entity';
import { Repository } from 'typeorm';
import { PhotoDetailDto } from './dto/photoDetail.dto';
import User from 'src/users/user.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photos)
    private photoRepository: Repository<Photos>,
  ) {}

  async getPhotosByUserId(userId: string) {
    const user = await this.photoRepository.find({
      where: { user: { id: userId } },
    });
    return user;
  }

  async deletePhoto(photoId: string, userId: string) {
    const deleteResponse = await this.photoRepository.delete(photoId);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // async createPhotoDetail(photoDetail: PhotoDetailDto, userId: number) {
  //   const photo = await this.photoRepository.create({
  //      ...photoDetail,
  //      userId
  //   });
  // }

  // async updatePhotosByUserId(photoDetail: PhotoDetailDto, userId: number ) {
  //   //  await this.photoRepository.update(userId: )
  // }

  // async upload(photoDetail: PhotoDetailDto, user: User) {
  //   const targetUser = await this.getPhotosByUserId(user.id);

  //   if(targetUser) {
  //     await this.updatePhotosByUserId(photoDetail, user.id);
  //   }else {
  //     await this.createPhotoDetail(photoDetail, user.id);
  //   }

  async uploadPhoto(data: Partial<Photos>) {
    const createPhoto = await this.photoRepository.create(data);
    return await this.photoRepository.save(createPhoto);
  }
}
