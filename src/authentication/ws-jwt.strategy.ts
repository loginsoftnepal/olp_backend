import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import TokenPayload from './tokenPayload.interface';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log('hellow world');
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    console.log('user is to be authenticated');
    const user = this.userService.getById(payload.userId);
    if (!user) {
      console.log('user not authenticated');
      throw new WsException('User not authenticated');
    }
    return user;
  }
}
