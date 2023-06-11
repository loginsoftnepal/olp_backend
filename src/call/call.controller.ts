import { Controller, Patch, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { UpdateCallDto } from './dto/UpdateCall.dto';
import { CallService } from './call.service';

@Controller('call')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Patch()
  @UseGuards(JwtAuthenticationGuard)
  async updateCall(call: UpdateCallDto) {
    return await this.callService.update(call);
  }
}
