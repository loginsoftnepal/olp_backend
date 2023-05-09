import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from '../authentication.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import User from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import * as Joi from 'joi';
import { DatabaseModule } from 'src/database/database.module';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            POSTGRES_URL: Joi.string().required(),
            ACCESS_TOKEN_SECRET: Joi.string().required(),
            ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
          }),
        }),
        DatabaseModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('ACCESS_TOKEN_SECRET'),
            signOptions: {
              expiresIn: `${configService.get(
                'ACCESS_TOKEN_EXPIRATION_TIME',
              )}m`,
            },
          }),
        }),
      ],
      providers: [AuthenticationService],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(typeof service.getCookieWithJwtToken(userId)).toEqual('string');
    });
  });
});

// describe('TheAuthenticationService', () => {
//   let authenticationService: AuthenticationService;
//   beforeEach(() => {
//     authenticationService = new AuthenticationService(
//       new UsersService(new Repository<User>()),
//       new JwtService({
//         secretOrPrivateKey: 'Secret Key',
//       }),
//       new ConfigService(),
//     );
//   });
//   describe('when creating a cookie', () => {
//     it('should return a string', () => {
//       const userId = 1;
//       expect(
//         typeof authenticationService.getCookieWithJwtToken(userId),
//       ).toEqual('string');
//     });
//   });
// });
