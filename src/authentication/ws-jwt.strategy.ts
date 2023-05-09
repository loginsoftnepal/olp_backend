import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import TokenPayload from './tokenPayload.interface';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = this.userService.getById(payload.userId);
    if (!user) {
      throw new HttpException(
        'User not authenticated',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return user;
  }
}
