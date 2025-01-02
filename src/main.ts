import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from './common/intercepters/response.interceptor';
import { logger } from './common/middlewares/logger.middleware';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  //body parsing
  app.use(express.json());
  app.use(logger);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
