import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { error, log } from 'console';
import { Request, Response } from 'express';
import { MyLoggerService } from 'src/logger/mylogger.log';
// import { WinstonLoggerService } from 'src/logger/winston.log';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: MyLoggerService;
  constructor() {
    this.logger = new MyLoggerService();
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    //* Logging logic here
    // this.logger.error(`${status} - ${message}`, {
    //   context: request.url,
    //   requestId: 'UUID',
    //   message,
    //   metadata: {},
    // });

    // this.logger.error(`${status} - ${message}`, [
    //   `${request.url}`,
    //   'uuid',
    //   { error: 'bad request' },
    // ]);

    const resMessage = `${status} - ${Date.now()}ms - Response: ${JSON.stringify(exception.stack)}`;

    this.logger.error(resMessage, [
      request.path,
      request['requestId'],
      message,
    ]);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
