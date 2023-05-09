import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ForgetPassword } from './forget-password.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ForgetPasswordService {
  constructor(
    @InjectRepository(ForgetPassword)
    private forgetPasswordRepository: Repository<ForgetPassword>,
  ) {}

  async deleteForgetPassword(userId: string) {
    const deleteResponse = await this.forgetPasswordRepository.delete(userId);
    // if (!deleteResponse.affected) {
    //   throw new HttpException(
    //     'Does not have forget Password',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
  }

  async createForgetPassword(token: string, userId: string) {
    const forgetPassword = this.forgetPasswordRepository.create({
      userId: userId,
      forgetPasswordToken: token,
      forgetPasswordExpire: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    await this.forgetPasswordRepository.save(forgetPassword);
    return forgetPassword;
  }

  async getByToken(token: string) {
    const forgetPassword = await this.forgetPasswordRepository.findOne({
      where: { forgetPasswordToken: token },
    });
    if (
      !forgetPassword ||
      Number(forgetPassword.forgetPasswordExpire) < Date.now()
    ) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    return forgetPassword;
  }
}
