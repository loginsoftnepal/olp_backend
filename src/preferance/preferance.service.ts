import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Preferance from './preferance.entity';
import { Repository } from 'typeorm';
import { CreatePrefDto } from './dto/createPref.dto';
import { UpdatePrefDto } from './dto/updatePref.dto';

@Injectable()
export class PreferanceService {
  constructor(
    @InjectRepository(Preferance)
    private preferanceRepository: Repository<Preferance>,
  ) {}

  async createPreferance(userId: string, createPref: CreatePrefDto) {
    const newPref = await this.preferanceRepository.create({
      ...createPref,
      userId: userId,
    });

    if (!newPref) {
      throw new HttpException(
        'Failed to create new Preferance detail',
        HttpStatus.NOT_FOUND,
      );
    }

    return newPref;
  }

  async updatePreferance(userId: string, updatePref: UpdatePrefDto) {
    const targetUpdatePref = await this.preferanceRepository.findOne({
      where: { userId: userId },
    });

    if (!targetUpdatePref) {
      throw new HttpException('Preferance not found', HttpStatus.NOT_FOUND);
    }

    await this.preferanceRepository.update(targetUpdatePref.id, updatePref);
    const updatedPref = await this.preferanceRepository.findOne({
      where: { userId: userId },
    });

    if (!updatedPref) {
      throw new HttpException('Preferance not found', HttpStatus.NOT_FOUND);
    }

    return updatedPref;
  }

  async getPreferanceDetail(userId: string) {
    const prefDetail = await this.preferanceRepository.findOne({
      where: { userId: userId },
    });
    if (!prefDetail) {
      throw new HttpException(
        'Preferance Detail not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return prefDetail;
  }

  async deletePreferanceDetail(prefId: string) {
    const deleteResponse = await this.preferanceRepository.delete(prefId);
    if (!deleteResponse.affected) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
