import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerification } from './email-verification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private emailVerificationRepository: Repository<EmailVerification>,
  ) {}

  async create(userId: string, token: string) {
    const emailVerification = this.emailVerificationRepository.create({
      userId: userId,
      emailVerificationToken: token,
      emailTokenExpire: (Date.now() + 1000 * 60 * 30).toString(),
    });

    await this.emailVerificationRepository.save(emailVerification);
    return emailVerification;
  }

  async getByUserId(userId: string) {
    const emailVerification = await this.emailVerificationRepository.findOne({
      where: { userId: userId },
    });
    return emailVerification;
  }

  async getByToken(token: string) {
    const emailVerification = await this.emailVerificationRepository.findOne({
      where: { emailVerificationToken: token },
    });
    if (
      !emailVerification ||
      Number(emailVerification.emailTokenExpire) < Date.now()
    ) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    return emailVerification;
  }

  async deleteEmailVerification(verificationId: string) {
    const deleteResponse = await this.emailVerificationRepository.delete(
      verificationId,
    );
    console.log(deleteResponse.affected);
    if (!deleteResponse.affected) {
      console.log('we reached here');
      throw new HttpException(
        'Does not have email verificaiton',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
