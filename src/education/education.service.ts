import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import CreateEducationDto from './dto/createEducation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import EducationEntity from './education.entity';
import { Repository } from 'typeorm';
import UpdateEducationDto from './dto/updateEducation.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private educationRepository: Repository<EducationEntity>,
  ) {}

  async createEducationDetail(
    userId: string,
    educationDetail: CreateEducationDto,
  ) {
    const newEducationDetail = this.educationRepository.create({
      ...educationDetail,
      userId: userId,
    });

    if (!newEducationDetail) {
      throw new HttpException(
        'Failed to create education detail',
        HttpStatus.NOT_FOUND,
      );
    }

    return newEducationDetail;
  }

  async updateEducationDetail(
    userId: string,
    educationDetail: UpdateEducationDto,
  ) {
    const tagrgetEducationDetail = await this.educationRepository.findOne({
      where: { userId: userId },
    });

    if (!tagrgetEducationDetail) {
      throw new HttpException('Family not found', HttpStatus.NOT_FOUND);
    }

    await this.educationRepository.update(
      tagrgetEducationDetail.id,
      educationDetail,
    );
    const updatedEducationDetail = await this.educationRepository.findOne({
      where: { userId: userId },
    });

    if (!updatedEducationDetail) {
      throw new HttpException(
        'Education Detail not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedEducationDetail;
  }

  async getEducationDetail(userId: string) {
    const educationDetail = await this.educationRepository.findOne({
      where: { userId: userId },
    });

    if (educationDetail) {
      throw new HttpException('Family detail not found', HttpStatus.NOT_FOUND);
    }
    return educationDetail;
  }

  async deleteEducationDetail(educationId: string) {
    const deleteResponse = await this.educationRepository.delete(educationId);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
