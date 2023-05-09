import { Body, Controller, Post, Req, Put, Get } from '@nestjs/common';
import { PreferanceService } from './preferance.service';
import { CreatePrefDto } from './dto/createPref.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { UpdatePrefDto } from './dto/updatePref.dto';

@Controller('preferance')
export class PreferanceController {
  constructor(private readonly preferanceService: PreferanceService) {}

  @Post()
  async createPreferance(
    @Body() createPref: CreatePrefDto,
    @Req() request: RequestWithUser,
  ) {
    return this.preferanceService.createPreferance(request.user.id, createPref);
  }

  @Put()
  async updatePreferance(
    @Body() updatePref: UpdatePrefDto,
    @Req() request: RequestWithUser,
  ) {
    return this.preferanceService.updatePreferance(request.user.id, updatePref);
  }

  @Get()
  async getPreferanceDetail(@Req() request: RequestWithUser) {
    return this.preferanceService.getPreferanceDetail(request.user.id);
  }
}
