import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UsersService } from 'src/users/users.service';
import { OAuth2Client } from 'google-auth-library';
import User from 'src/users/user.entity';

@Injectable()
export class GoogleAuthenticationService {
  private client: any;
  private ticket: any;
  private clientId: string;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {
    this.clientId = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    this.client = new OAuth2Client(this.clientId);
  }

  async authenticate(token: string) {
    try {
      this.ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.clientId,
      });

      const payload = this.ticket.getPayload();

      const email = payload?.email;
      const user = await this.usersService.getByEmail(email);
      if (user) {
        return this.handleRegisteredUser(user);
      }
      return this.registerUser(payload, email);
    } catch (error) {
      throw new HttpException(error, HttpStatus.NOT_FOUND);
    }
  }

  async registerUser(payload: any, email: string) {
    const username = payload.name;
    const user = await this.usersService.createWithGoogle(email, username);

    return this.handleRegisteredUser(user);
  }

  async getCookiesForUser(user: User) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );
    const { cookie: refreshTokenCookie, token } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(token, user.id);

    return { accessTokenCookie, refreshTokenCookie };
  }

  async handleRegisteredUser(user: User) {
    if (!user.isGoogleAuth) {
      throw new UnauthorizedException();
    }

    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(user);

    return {
      accessTokenCookie,
      refreshTokenCookie,
      user,
    };
  }
}
