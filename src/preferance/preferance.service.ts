import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Preferance from './preferance.entity';
import { Repository } from 'typeorm';
import { CreatePrefDto } from './dto/createPref.dto';
import { UpdatePrefDto } from './dto/updatePref.dto';
import User from 'src/users/user.entity';

@Injectable()
export class PreferanceService {
  constructor(
    @InjectRepository(Preferance)
    private preferanceRepository: Repository<Preferance>,
  ) {}

  async createPreferance(user: User, createPref: UpdatePrefDto) {
    const newPref = await this.preferanceRepository.create({
      ...createPref,
      user: { id: user.id },
    });

    if (!newPref) {
      throw new HttpException(
        'Failed to create new Preferance detail',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.preferanceRepository.save(newPref);
    return newPref;
  }

  async updatePreferance(user: User, updatePref: UpdatePrefDto) {
    const targetUpdatePref = await this.preferanceRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!targetUpdatePref) {
      throw new HttpException('Preferance not found', HttpStatus.NOT_FOUND);
    }

    await this.preferanceRepository.update(targetUpdatePref.id, updatePref);
    const updatedPref = await this.preferanceRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!updatedPref) {
      throw new HttpException('Preferance not found', HttpStatus.NOT_FOUND);
    }

    return updatedPref;
  }

  async getPreferanceDetail(user: User) {
    const prefDetail = await this.preferanceRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
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
