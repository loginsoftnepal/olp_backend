import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Like, Repository } from 'typeorm';
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
import {
  EducationParams,
  FamilyParams,
  PreferanceParams,
  ProfileParams,
} from 'src/utils/types';
import { ProfileService } from 'src/profile/profile.service';
import { FamilyService } from 'src/family/family.service';
import { PreferanceService } from 'src/preferance/preferance.service';
import { EducationService } from 'src/education/education.service';
import { Peer } from 'src/peer/peer.entity';
import { BannerService } from 'src/banner/banner.service';
import { query } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly userAvatarService: UserAvatarService,
    private readonly forgetPasswordService: ForgetPasswordService,
    private readonly configService: ConfigService,
    private readonly emailScheduleService: EmailScheduleService,
    private readonly profileService: ProfileService,
    private readonly familyService: FamilyService,
    private readonly preferanceService: PreferanceService,
    private readonly educationService: EducationService,
    private readonly bannerService: BannerService,
    @InjectRepository(Peer) private readonly peerRepository: Repository<Peer>,
    private connection: Connection,
  ) {}

  async createWithGoogle(email: string, name: string, picture: string) {
    const newUser = this.usersRepository.create({
      email: email,
      username: name,
      googleAvatar: picture,
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
    // console.log('searching');
    if (id === 'research') {
      return;
    }
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: [
        'profile',
        'family',
        'education',
        'preferance',
        'photos',
        'banner',
      ],
    });
    // console.log(user);
    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async findByUserName(username: string) {
    const users = await this.usersRepository.find({
      where: { profile: { fullname: Like(`%${username}%`) } },
      relations: ['profile', 'family', 'education', 'preferance'],
    });
    console.log(users);
    return users;
  }

  async filterUser(query: any) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.education', 'education')
      .leftJoinAndSelect('user.family', 'family');

    if (query.religion) {
      queryBuilder.andWhere('profile.religion = :religion', {
        religion: query.religion,
      });
    }

    if (query.annualIncome) {
      queryBuilder.andWhere('education.annualIncocme = :annualIncome', {
        annualIncome: query.annualIncocme,
      });
    }

    if (query.caste) {
      queryBuilder.andWhere('profile.caste = :caste', {
        caste: query.caste,
      });
    }

    if (query.maritalStatus) {
      queryBuilder.andWhere('profile.maritalStatus = :maritalStatus', {
        maritalStatus: query.maritalStatus,
      });
    }

    if (query.maxAge) {
      const currentYear = new Date().getFullYear();
      const minBirthyear = currentYear - query.maxAge - 1;

      queryBuilder.andWhere('profile.year >= :year', {
        year: minBirthyear,
      });
    }

    if (query.minAge) {
      const currentYear = new Date().getFullYear();
      const maxBirthyear = currentYear - query.minAge;
      queryBuilder.andWhere(`profile.year <= :minYear`, {
        minYear: maxBirthyear,
      });
    }

    const result = await queryBuilder.getMany();
    return result;
  }

  async letsBegin(
    searchingFor: string,
    ageFrom: string,
    ageTo: string,
    caste: string,
    user: User,
  ) {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile');

    if (searchingFor) {
      let sex;
      if (searchingFor == 'brother') {
        sex = 'woman';
      } else if (searchingFor == 'sister') {
        sex = 'man';
      } else if (searchingFor == 'myself') {
        sex = user.profile.sex == 'man' ? 'woman' : 'man';
      }
      queryBuilder.andWhere('profile.sex = :sex', {
        sex: sex,
      });
    }

    if (caste) {
      queryBuilder.andWhere('profile.caste = :caste', {
        caste: caste,
      });
    }

    if (ageFrom) {
      const currentYear = new Date().getFullYear();
      const maxBirthyear = currentYear - Number(ageFrom);
      queryBuilder.andWhere('profile.year <= :year', {
        year: maxBirthyear,
      });
    }

    if (ageTo) {
      const currentYear = new Date().getFullYear();
      const minBirthyear = currentYear - Number(ageTo);

      queryBuilder.andWhere('profile.year >= :year', {
        year: minBirthyear,
      });
    }

    const result = await queryBuilder.getMany();
    return result;
  }

  async getRecommendation(user: User) {
    const requiredGender = user?.profile?.sex === 'Male' ? 'Female' : 'Male';
    const requiredReligon =
      user.preferance.religion === 'Religion No Boundry'
        ? '*'
        : user.profile.religion;
    const requiredCaste = (user.preferance.caste = 'Caste No bar'
      ? '*'
      : user.profile.caste);

    const users = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.education', 'education')
      .leftJoinAndSelect('user.family', 'family')
      .where('profile.sex = :sex', { sex: requiredGender })
      .andWhere('profile.religion = :religion', { religion: requiredReligon })
      .andWhere('profile.caste = :caste', { caste: requiredCaste })
      .orderBy('RANDOM()')
      .getMany();

    if (users && users.length <= 0) {
      const moreUser = await this.usersRepository.find({
        where: { profile: { sex: requiredGender } },
      });

      return moreUser;
    }
    return users;
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

    // throw new HttpException(
    //   'User with this email does not exist',
    //   HttpStatus.NOT_FOUND,
    // );
  }

  async create(userData: CreateUserDto) {
    console.log(userData);
    const peer = this.peerRepository.create();
    const newUser = this.usersRepository.create({ ...userData, peer });

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
      html: content,
      date: new Date(Date.now() + 1000 * 60),
    });
  }

  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new HttpException('Password must match', HttpStatus.NOT_FOUND);
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.passwordVerify(oldPassword, user.password);

    const hashNewPassword = await this.hashPassword(newPassword);
    user.password = hashNewPassword;
    await this.usersRepository.save(user);
    console.log('password changed successfully');
    return user;
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

  public async emailVerify(userId: string) {
    const user = await this.getById(userId);
    user.emailVerified = true;
    await this.usersRepository.save(user);
    return user;
  }

  private async hashPassword(newPassword: string) {
    return await bcrypt.hash(newPassword, 10);
  }

  async addBanner(userId: string, file: any) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
      });
      const currentBannerId = user?.banner?.id;

      const banner = await this.bannerService.uploadUserBanner(
        file,
        queryRunner,
        user,
      );
      await queryRunner.manager.update(User, userId, {
        banner: banner,
      });

      if (currentBannerId) {
        await this.bannerService.deleteBannerWithQueryRunner(
          currentBannerId,
          queryRunner,
        );
      }

      await queryRunner.commitTransaction();

      return banner;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
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

  async updateProfile(params: ProfileParams) {
    const user = await this.getById(params.userId);

    const currentProfile = user.profile;

    let profile;
    if (currentProfile) {
      profile = this.profileService.updateProfile(user, params.profileDetail);
    } else {
      profile = await this.profileService.createProfile(
        user,
        params.profileDetail,
      );
    }
    const newProfile = await this.profileService.getAProfile(params.userId);
    user.profile = newProfile;
    await this.usersRepository.save(user);
    return profile;
  }

  async updateFamily(params: FamilyParams) {
    const user = await this.getById(params.userId);

    const currentFamily = user.family;
    let family;
    if (currentFamily) {
      family = this.familyService.updateFamily(user, params.familyDetail);
    } else {
      family = this.familyService.createFamily(user, params.familyDetail);
    }

    const newFamily = await this.familyService.getFamilyDetail(user);
    user.family = newFamily;
    await this.usersRepository.save(user);
    return family;
  }

  async updateEducation(params: EducationParams) {
    const user = await this.getById(params.userId);

    const currentEducation = user.education;
    let education;
    if (currentEducation) {
      education = this.educationService.updateEducationDetail(
        user,
        params.educationDetail,
      );
    } else {
      education = this.educationService.createEducationDetail(
        user,
        params.educationDetail,
      );
    }

    const newEducation = await this.educationService.getEducationDetail(user);
    user.education = newEducation;
    await this.usersRepository.save(user);
    return education;
  }

  async updatePreferance(params: PreferanceParams) {
    const user = await this.getById(params.userId);

    const currentPreferance = user.preferance;
    let preferance;
    if (currentPreferance) {
      preferance = this.preferanceService.updatePreferance(
        user,
        params.preferanceDetail,
      );
    } else {
      preferance = this.preferanceService.createPreferance(
        user,
        params.preferanceDetail,
      );
    }

    const newPreferance = await this.preferanceService.getPreferanceDetail(
      user,
    );
    user.preferance = newPreferance;
    await this.usersRepository.save(user);
    return preferance;
  }
}
