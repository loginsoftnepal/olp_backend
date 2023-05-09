import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { EducationService } from './education.service';
import CreateEducationDto from './dto/createEducation.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import UpdateEducationDto from './dto/updateEducation.dto';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  async createEducationDetail(
    @Body() educationDetail: CreateEducationDto,
    @Req() request: RequestWithUser,
  ) {
    return this.educationService.createEducationDetail(
      request.user.id,
      educationDetail,
    );
  }

  @Put()
  async updateEducationDetail(
    @Body() educationDetail: UpdateEducationDto,
    @Req() request: RequestWithUser,
  ) {
    return this.educationService.updateEducationDetail(
      request.user.id,
      educationDetail,
    );
  }

  @Get()
  async getEducationDetail(@Req() request: RequestWithUser) {
    return this.educationService.getEducationDetail(request.user.id);
  }
}
