import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { EducationService } from './education.service';
import CreateEducationDto from './dto/createEducation.dto';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import UpdateEducationDto from './dto/updateEducation.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('education')
@ApiTags('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  async createEducationDetail(
    @Body() educationDetail: UpdateEducationDto,
    @Req() request: RequestWithUser,
  ) {
    return this.educationService.createEducationDetail(
      request.user,
      educationDetail,
    );
  }

  @Put()
  async updateEducationDetail(
    @Body() educationDetail: UpdateEducationDto,
    @Req() request: RequestWithUser,
  ) {
    return this.educationService.updateEducationDetail(
      request.user,
      educationDetail,
    );
  }

  @Get()
  async getEducationDetail(@Req() request: RequestWithUser) {
    return this.educationService.getEducationDetail(request.user);
  }
}
