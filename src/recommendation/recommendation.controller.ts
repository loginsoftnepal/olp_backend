import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { skip } from 'rxjs';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { ConnectionRequestsService } from 'src/connection-requests/connection-requests.service';
import { ConnectionService } from 'src/connection/connection.service';
import { UsersService } from 'src/users/users.service';

@Controller('recommendation')
export class RecommendationController {
  constructor(
    private readonly usersService: UsersService,
    private readonly connectionRequestService: ConnectionRequestsService,
    private readonly connectionService: ConnectionService,
  ) {}

  @Get('filter')
  @UseGuards(JwtAuthenticationGuard)
  async filterUser(
    @Req() request: RequestWithUser,
    @Query('minHeight') minHeight?: string,
    @Query('maxHeight') maxHeight?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('maritalStatus') maritalStatus?: string,
    @Query('religion') religion?: string,
    @Query('caste') caste?: string,
    @Query('annualIncome') annualIncome?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    console.log('we are here');
    const result = await this.usersService.filterUser({
      minHeight,
      maxHeight,
      minAge,
      maxAge,
      maritalStatus,
      religion,
      caste,
      annualIncome,
      page,
      limit,
    });

    return Promise.all(
      result.map(async (user) => {
        return {
          id: user.id,
          fullname: user.profile.fullname,
          year: user.profile.year,
          month: user.profile.month,
          day: user.profile.day,
          address: user.profile.address,
          caste: user.profile.caste,
          religion: user.profile.religion,
          avatarId: user.avatarId,
          occupation: user.education.occupation,
          isConnected: (await this.connectionService.isConnection(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
          isPending: (await this.connectionRequestService.isPending(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
        };
      }),
    );
  }

  @Get('letsBegin')
  @UseGuards(JwtAuthenticationGuard)
  async searchFromHome(
    @Req() request: RequestWithUser,
    @Query('searching_for') searchingFor: string,
    @Query('ageFrom') ageFrom: string,
    @Query('ageTo') ageTo: string,
    @Query('caste') caste: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    console.log('we are herre');
    const result = await this.usersService.letsBegin(
      searchingFor,
      ageFrom,
      ageTo,
      caste,
      request.user,
      page,
      limit,
    );

    return Promise.all(
      result.map(async (user) => {
        return {
          id: user.id,
          fullname: user.profile.fullname,
          year: user.profile.year,
          month: user.profile.month,
          day: user.profile.day,
          address: user.profile.address,
          religion: user.profile.religion,
          avatarId: user.avatarId,
          occupation: user.education.occupation,
          isConnected: (await this.connectionService.isConnection(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
          isPending: (await this.connectionRequestService.isPending(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
        };
      }),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  async getUserById(@Req() request: RequestWithUser, @Param('id') id: string) {
    const user = await this.usersService.getById(id);
    return {
      ...user,
      currentHashedRefreshToken: null,
      password: null,
      isGoogleAuth: null,
      isConnected: (await this.connectionService.isConnection(
        request.user.id,
        user.id,
      ))
        ? true
        : false,
      isPending: (await this.connectionRequestService.isPending(
        request.user.id,
        user.id,
      ))
        ? true
        : false,
    };
  }

  @Get('search')
  @UseGuards(JwtAuthenticationGuard)
  async searchUser(
    @Req() request: RequestWithUser,
    @Query('username') username: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    console.log(username);
    const result = await this.usersService.findByUserName(
      username,
      page,
      limit,
    );
    return Promise.all(
      result.map(async (user) => {
        return {
          id: user.id,
          fullname: user.profile.fullname,
          year: user.profile.year,
          month: user.profile.month,
          day: user.profile.day,
          address: user.profile.address,
          caste: user.profile.caste,
          religion: user.profile.religion,
          avatarId: user.avatarId,
          occupation: user.education.occupation,
          isConnected: (await this.connectionService.isConnection(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
          isPending: (await this.connectionRequestService.isPending(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
        };
      }),
    );
  }

  @Get('research/:username')
  @UseGuards(JwtAuthenticationGuard)
  async researchUser(
    @Req() request: RequestWithUser,
    @Param('username') username: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    console.log(username);
    const result = await this.usersService.findByUserName(
      username,
      page,
      limit,
    );
    console.log(result);
    return Promise.all(
      result.map(async (user) => {
        return {
          id: user.id,
          fullname: user.profile.fullname,
          year: user.profile.year,
          month: user.profile.month,
          day: user.profile.day,
          address: user.profile.address,
          caste: user.profile.caste,
          religion: user.profile.religion,
          avatarId: user.avatarId,
          occupation: user.education.occupation,
          isConnected: (await this.connectionService.isConnection(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
          isPending: (await this.connectionRequestService.isPending(
            request.user.id,
            user.id,
          ))
            ? true
            : false,
        };
      }),
    );
  }

  @Get('recommend/user')
  @UseGuards(JwtAuthenticationGuard)
  async recommendUsers(@Req() request: RequestWithUser) {
    const result = await this.usersService.getRecommendation(request.user);
    const resultToReturn = result.map(async (user) => {
      return {
        id: user.id,
        fullname: user.profile.fullname,
        year: user.profile.year,
        month: user.profile.month,
        day: user.profile.day,
        address: user.profile.address,
        caste: user.profile.caste,
        religion: user.profile.religion,
        avatarId: user.avatarId,
        occupation: user.education.occupation,
        isConnected: (await this.connectionService.isConnection(
          request.user.id,
          user.id,
        ))
          ? true
          : false,
        isPending: (await this.connectionRequestService.isPending(
          request.user.id,
          user.id,
        ))
          ? true
          : false,
      };
    });
    return Promise.all(resultToReturn);
  }
}
