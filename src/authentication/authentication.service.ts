import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import RegisterDto from './dto/Register.dto';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import CreateAdminDto from './dto/requestCreateAdmin.dto';
import { AdminService } from 'src/admin/admin.service';
import { randomBytes } from 'crypto';
import { EmailScheduleService } from 'src/email-schedule/email-schedule.service';
import { EmailVerification } from 'src/email-verification/email-verification.entity';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly emailScheduleService: EmailScheduleService,
  ) {}

  // Method to register data
  public async register(registrationData: RegisterDto) {
    const hashedPassword = await this.hashPassword(registrationData.password);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async hashPassword(newPassword: string) {
    return await bcrypt.hash(newPassword, 10);
  }

  public async generateVerificationToken(length: number) {
    console.log(length);
    return randomBytes(length).toString('hex');
  }

  public async sendVerificaitonEmail(userId: string, email: string) {
    console.log(userId, email);
    const verificationToken = await this.generateVerificationToken(24);
    const client_url = this.configService.get('CLIENT_URL');
    await this.emailVerificationService.create(userId, verificationToken);
    const recipient = email;
    const subject = `Verify Email`;
    const html = `
    <h1>Verify your email address</h1>
    <p style="font-size: 16px; font-weight: 600">Click to link below to verify Email. </p>
    <p style="font-size: 14px; font-weight: 600; color: red;">Ignore this if you don't ask for it</p>
    <br />
    <a style = "font-size: 14px;" href=${client_url}/email/verify/${verificationToken}?userId=${userId}> Click here to verify your email </a>
`;

    this.emailScheduleService.scheduleEmail({
      recipient,
      subject,
      html,
      date: new Date(Date.now() + 1000 * 60),
    });
  }
  // Method to register admin
  public async registerAdmin(adminDetail: CreateAdminDto) {
    if (adminDetail.password !== adminDetail.confirmPassword) {
      throw new HttpException(
        'password and confirmPassword must match',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await this.hashPassword(adminDetail.password);

    try {
      const createdAdmin = await this.adminService.createAdmin({
        ...adminDetail,
        password: hashedPassword,
      });

      createdAdmin.password = undefined;
      return createdAdmin;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Invalid Admin', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        'Something went wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentails provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}d`,
    });
    return `Authentication=${token}; Path=/; Max-Age=${this.configService.get(
      'ACCESS_TOKEN_EXPIRATION_TIME',
    )}d`;
  }

  public getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}d`,
    });

    const cookie = `Refresh=${token}; Path=/;  Max-Age=${this.configService.get(
      'REFRESH_TOKEN_EXPIRATION_TIME',
    )}d`;
    return { cookie, token };
  }

  public getCookiesForLogOut() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async verifyPasswordforChange(
    oldPassword: string,
    hashedPassword: string,
  ) {
    await this.verifyPassword(oldPassword, hashedPassword);
  }

  public async resendVerificationEmail(userId: string, email: string) {
    const emailVerification = await this.emailVerificationService.getByUserId(
      userId,
    );
    if (emailVerification) {
      await this.emailVerificationService.deleteEmailVerification(
        emailVerification.id,
      );
    }

    await this.sendVerificaitonEmail(userId, email);
  }

  public async verifyEmail(userId: string, resetToken: string) {
    console.log('we reached to ');
    const emailVerification = await this.emailVerificationService.getByToken(
      resetToken,
    );
    const user = await this.usersService.emailVerify(userId);
    await this.emailVerificationService.deleteEmailVerification(
      emailVerification.id,
    );
    return user;
  }
}
