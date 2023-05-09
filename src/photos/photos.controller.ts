import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  Req,
  UploadedFile,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { PhotosService } from './photos.service';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { diskStorage } from 'multer';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  // @Post('upload/multiple')
  // @UseGuards(JwtAuthenticationGuard)
  // @UseInterceptors(
  //   FileFieldsInterceptor(
  //     [
  //       { name: 'picture1', maxCount: 1 },
  //       { name: 'picture2', maxCount: 1 },
  //       { name: 'picture3', maxCount: 1 },
  //       { name: 'picture4', maxCount: 1 },
  //       { name: 'picture5', maxCount: 1 },
  //     ],
  //     {
  //       storage: diskStorage({
  //         destination: './uploadedFiles/avatars',
  //       }),
  //     },
  //   ),
  // )
  // async uploadPhoto(
  //   @Req() request: RequestWithUser,
  //   @UploadedFiles()
  //   files: {
  //     picture1?: Express.Multer.File[];
  //     picture2?: Express.Multer.File[];
  //     picture3?: Express.Multer.File[];
  //     picture4?: Express.Multer.File[];
  //     picture5?: Express.Multer.File[];
  //   },
  // ) {
  //   return this.photosService.uploadPhoto(request.user.id);
  // }
}
