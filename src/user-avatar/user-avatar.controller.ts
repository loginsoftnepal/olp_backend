import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserAvatarService } from './user-avatar.service';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('user-avatar')
@UseInterceptors(ClassSerializerInterceptor)
export default class UserAvatarController {
  constructor(private readonly userAvatarService: UserAvatarService) {}

  @Get(':id')
  async getUserAvatarById(
    @Res({ passthrough: true }) response: Response,
    @Param('id') id: string,
  ) {
    const file = await this.userAvatarService.getFileById(id);
    const stream = Readable.from(file.data);
    // stream.pipe(response);
    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }
}
