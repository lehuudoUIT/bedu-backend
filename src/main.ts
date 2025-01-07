import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from './common/intercepters/response.interceptor';
import { logger } from './common/middlewares/logger.middleware';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins =
    process.env.NODE_ENV === 'dev' ? '*' : process.env.ALLOW_ORIGIN;
  app.enableCors({
    origin: (origin, callback) => {
      if (
        allowedOrigins === '*' ||
        !origin ||
        allowedOrigins.split(',').includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  //body parsing
  app.use(express.json());
  app.use(logger);

  const port = process.env.PORT;

  await app.listen(port ?? 3004);
  console.log(`App listen on port ${port}`);
}
bootstrap();
