import { BadRequestException, Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { createReadStream, unlinkSync } from 'fs';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_BUCKET_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow('AWS_BUCKET_SECRET_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async uploadImageFromLocal(file: Express.Multer.File) {
    const imageName: string =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;

    const fileStream = createReadStream(file.path);

    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
      Key: imageName,
      Body: fileStream,
      ContentType: file.mimetype,
    });

    const result = await this.s3Client.send(command);
    if (result) unlinkSync(file.path);

    const url: string = `${this.configService.getOrThrow('AWS_CLOUD_FRONT_URL')}/${imageName}`;

    const signedUrl = await this.signImageCloudfront(url);

    return {
      url,
      signedUrl,
    };
  }

  async uploadMultipleImageFromLocal(files: Express.Multer.File[]) {
    const imagesName: string[] = files.map((file) => {
      return (
        Date.now() +
        '-' +
        Math.round(Math.random() * 1e9) +
        '-' +
        file.originalname
      );
    });
    const filesStream = files.map((file) => {
      return createReadStream(file.path);
    });
    const commands: PutObjectCommand[] = [];
    for (let i = 0; i < imagesName.length; i++) {
      commands.push(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
          Key: imagesName[i],
          Body: filesStream[i],
          ContentType: files[i].mimetype,
        }),
      );
    }

    const result = await Promise.all(
      commands.map((command) => {
        return this.s3Client.send(command);
      }),
    );

    if (result) {
      for (let i = 0; i < files.length; i++) {
        unlinkSync(files[i].path);
      }
    }

    const urls: string[] = imagesName.map((imageName) => {
      return `${this.configService.getOrThrow('AWS_CLOUD_FRONT_URL')}/${imageName}`;
    });

    const signedUrls = await Promise.all(
      urls.map((url) => {
        return this.signImageCloudfront(url);
      }),
    );

    return {
      urls,
      signedUrls,
    };
  }

  async signImageCloudfront(url: string) {
    return getSignedUrl({
      url,
      keyPairId: this.configService.getOrThrow('AWS_CLOUD_FRONT_KEYPAIRID'),
      dateLessThan: new Date(
        Date.now() +
          1000 * this.configService.getOrThrow('AWS_CLOUD_FRONT_EXPIRE_TIME'),
      ).toString(),
      privateKey: this.configService.getOrThrow('AWS_CLOUD_FRONT_PRIVATE_KEY'),
    });
  }
}
