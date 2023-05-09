import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import CreateFamilyDto from './dto/createFamily.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import UpdateFamilyDto from './dto/updateFamily.dto';
import { FamilyService } from './family.service';

@Controller('family')
export class FamilyController {
  constructor(private readonly familyService: FamilyService) {}

  @Post()
  async createFamilyDetail(
    @Body() familyDetail: CreateFamilyDto,
    @Req() request: RequestWithUser,
  ) {
    return this.familyService.createFamily(request.user.id, familyDetail);
  }

  @Put()
  async updateFamilyDetail(
    @Body() familyDetail: UpdateFamilyDto,
    @Req() request: RequestWithUser,
  ) {
    return this.familyService.updateFamily(request.user.id, familyDetail);
  }

  @Get()
  async getFamilyDetail(@Req() request: RequestWithUser) {
    return this.familyService.getFamilyDetail(request.user.id);
  }
}
