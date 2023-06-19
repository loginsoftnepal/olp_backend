import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Call } from './call.entity';
import { Repository } from 'typeorm';
import { CreateCallDto } from 'src/message/dto/createCall.dto';
import { UpdateCallDto } from './dto/UpdateCall.dto';

@Injectable()
export class CallService {
  constructor(
    @InjectRepository(Call)
    private readonly callRepository: Repository<Call>,
  ) {}

  async create(call: CreateCallDto) {
    const { type, status } = call;
    const startTime = new Date(Date.now());
    // const startTime = `${date.getHours()}:${
    //   date.getMinutes
    // }: ${date.getSeconds()}`;

    const newCall = this.callRepository.create({
      type,
      status,
      startTime,
    });
    return await this.callRepository.save(newCall);
  }

  async update(call: UpdateCallDto) {
    const { status, id } = call;
    const targetCall = await this.getById(id);
    // console.log(id);
    const endTime = new Date(Date.now());
    // const endTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    if (!targetCall) {
      throw new HttpException('Call not found', HttpStatus.NOT_FOUND);
    }
    await this.callRepository.update(targetCall.id, {
      status: status,
      endTime: endTime,
    });

    const updateCallDetail = await this.callRepository.findOne({
      where: { id: id },
    });
    // console.log(updateCallDetail);

    if (!updateCallDetail) {
      throw new HttpException('Call Detail not found', HttpStatus.NOT_FOUND);
    }

    return updateCallDetail;
  }

  async getById(id: string) {
    return await this.callRepository.findOne({
      where: { id: id },
    });
  }
}
