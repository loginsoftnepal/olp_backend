import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { UsersModule } from 'src/users/users.module';
import { ConnectionModule } from 'src/connection/connection.module';
import { ConnectionRequest } from 'src/connection-requests/connection-request.entity';
import { ConnectionRequestsModule } from 'src/connection-requests/connection-requests.module';

@Module({
  imports: [UsersModule, ConnectionModule, ConnectionRequestsModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
