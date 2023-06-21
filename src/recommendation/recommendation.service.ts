import { Injectable } from '@nestjs/common';
import { ConnectionRequestsService } from 'src/connection-requests/connection-requests.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly connectionRequest: ConnectionRequestsService,
  ) {}
}
