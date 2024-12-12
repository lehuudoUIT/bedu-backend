import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadDisk } from 'src/configs/multer.config';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', uploadDisk))
  async uploadImageFromLocal(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: /^image\/.*/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      message: 'Upload file to S3 successfully!',
      metadata: await this.uploadService.uploadImageFromLocal(file),
    };
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 5, uploadDisk))
  async uploadMultiImagesFromLocal(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: /^image\/.*/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return {
      message: 'Upload file to S3 successfully!',
      metadata: await this.uploadService.uploadMultipleImageFromLocal(files),
    };
  }

  @Post('url')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageFromUrl(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1000 }),
          new FileTypeValidator({ fileType: /^image\/.*/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      message: 'Upload file to S3 successfully!',
      metadata: await this.uploadService.uploadImageFromLocal(file),
    };
  }

  @Post('sign')
  async signImageCloudFront(@Body('url') url: string) {
    return {
      message: 'Sign image s3 successfully!',
      metadata: await this.uploadService.signImageCloudfront(url),
    };
  }
}
