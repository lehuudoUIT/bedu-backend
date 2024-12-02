import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from './common/intercepters/response.interceptor';
import { logger } from './common/middlewares/logger.middleware';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  //body parsing
  app.use(express.json());
  app.use(logger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
