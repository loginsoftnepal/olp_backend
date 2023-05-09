import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Family from './family.entity';
import UpdateFamilyDto from './dto/updateFamily.dto';
import CreateFamilyDto from './dto/createFamily.dto';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
  ) {}

  async createFamily(userId: string, familyDetail: CreateFamilyDto) {
    const newFamily = this.familyRepository.create({
      ...familyDetail,
      userId: userId,
    });

    if (!newFamily) {
      throw new HttpException(
        'Failed to create Family Detail',
        HttpStatus.NOT_FOUND,
      );
    }

    return newFamily;
  }

  async updateFamily(userId: string, familyDetail: UpdateFamilyDto) {
    const targetFamilyDetail = await this.familyRepository.findOne({
      where: { userId: userId },
    });

    if (!targetFamilyDetail) {
      throw new HttpException('Family not found', HttpStatus.NOT_FOUND);
    }

    await this.familyRepository.update(targetFamilyDetail.id, familyDetail);
    const updatedFamilyDetail = await this.familyRepository.findOne({
      where: { userId: userId },
    });

    if (!updatedFamilyDetail) {
      throw new HttpException('Family Detail not found', HttpStatus.NOT_FOUND);
    }

    return updatedFamilyDetail;
  }

  async getFamilyDetail(userId: string) {
    const familyDetail = await this.familyRepository.findOne({
      where: { userId: userId },
    });
    if (!familyDetail) {
      throw new HttpException('Family detail not found', HttpStatus.NOT_FOUND);
    }

    return familyDetail;
  }

  async deleteFamilyDetail(familyId: string) {
    const deleteResponse = await this.familyRepository.delete(familyId);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
