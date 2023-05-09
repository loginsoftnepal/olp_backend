import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import User from './user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserAvatarService } from 'src/user-avatar/user-avatar.service';
import { ForgetPasswordService } from 'src/forget-password/forget-password.service';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EmailScheduleService } from 'src/email-schedule/email-schedule.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly userAvatarService: UserAvatarService,
    private readonly forgetPasswordService: ForgetPasswordService,
    private readonly configService: ConfigService,
    private readonly emailScheduleService: EmailScheduleService,
    private connection: Connection,
  ) {}

  async createWithGoogle(email: string, name: string) {
    const newUser = this.usersRepository.create({
      email: email,
      username: name,
      isGoogleAuth: true,
    });

    await this.usersRepository.save(newUser);
    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { currentHashedRefreshToken });
  }

  async getById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async removeRefreshToken(userId: string) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async updateUser(userId: string, userDetail: UpdateUserDto) {
    console.log(userDetail);
    await this.usersRepository.update(userId, { ...userDetail });
    const user = this.usersRepository.findOne({ where: { id: userId } });
    if (user) {
      return user;
    }

    throw new HttpException('user not found', HttpStatus.NOT_FOUND);
  }

  async deleteUser(userId: string) {
    const deleteResponse = await this.usersRepository.delete(userId);
    if (!deleteResponse.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async forgetPassword(user: User) {
    await this.forgetPasswordService.deleteForgetPassword(user.id);
    const resetPasswordToken = randomBytes(24).toString('hex');

    await this.forgetPasswordService.createForgetPassword(
      resetPasswordToken,
      user.id,
    );

    const subject = 'Forgot your Password';
    const content = `
    <h1>Forgot your password</h1>
    <p style="font-size: 16px; font-weight: 600;">Click the link below to reset your password</p>
    <a style="font-size: 14px;" href="${this.configService.get(
      'CLIENT_URL',
    )}/reset/password/${resetPasswordToken}" target="_blank">Click here to reset your password.</a>
 `;

    this.emailScheduleService.scheduleEmail({
      recipient: user.email,
      subject: subject,
      content: content,
      date: new Date(Date.now() + 1000 * 60),
    });
  }

  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.passwordVerify(oldPassword, user.password);

    const hashNewPassword = await this.hashPassword(newPassword);
    user.password = hashNewPassword;
    await this.usersRepository.save(user);
  }

  public async resetPassword(resetPassword: ResetPasswordDto, token: string) {
    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      throw new HttpException('Password must match', HttpStatus.NOT_FOUND);
    }

    const forgetPassword = await this.forgetPasswordService.getByToken(token);

    const user = await this.getById(forgetPassword.userId);

    if (!user) {
    }

    user.password = await this.hashPassword(resetPassword.newPassword);
    user.isGoogleAuth = false;
    // user.isEmailVerified = true;
    await this.forgetPasswordService.deleteForgetPassword(user.id);
    // await this.emailVerifyService.deleteEmailVerify(user.id);
    user.currentHashedRefreshToken = null;
    await this.usersRepository.save(user);
  }

  private async passwordVerify(oldPassword: string, newPassword: string) {
    const passwordMatched = await bcrypt.compare(oldPassword, newPassword);
    if (!passwordMatched) {
      throw new HttpException('Invalid Password', HttpStatus.NOT_FOUND);
    }
  }

  private async hashPassword(newPassword: string) {
    return await bcrypt.hash(newPassword, 10);
  }

  async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
    console.log(userId, filename);
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      const currentAvatarId = user.avatarId;

      const avatar = await this.userAvatarService.uploadUserAvatar(
        imageBuffer,
        filename,
        queryRunner,
      );
      await queryRunner.manager.update(User, userId, {
        avatarId: avatar.id,
      });

      if (currentAvatarId) {
        await this.userAvatarService.deleteFileWithQueryRunner(
          currentAvatarId,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return avatar;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
