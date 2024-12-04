import { Injectable, LoggerService } from '@nestjs/common';
import { LogParam } from 'src/utils/types';
import * as winston from 'winston';
const { format, transports, createLogger } = winston;
import 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';

// Define the logging service
@Injectable()
export class MyLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const formatPrint = format.printf(
      ({ level, message, context, requestId, timestamp, metadata }) => {
        return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`;
      },
    );

    const transportDailyInfoFile = new transports.DailyRotateFile({
      dirname: 'src/logs',
      filename: 'application-%DATE%.info.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true, //! backup log zip
      maxSize: '20m', //! Dung luong file toi da de tach
      maxFiles: '14d', //! Neu dat thi se xoa log trong 14 ngay
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        formatPrint,
      ),
    });

    const transportDailyErrorFile = new transports.DailyRotateFile({
      dirname: 'src/logs',
      filename: 'application-%DATE%.error.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true, //! backup log zip
      maxSize: '1m', //! Dung luong file toi da de tach
      maxFiles: '14d', //! Neu dat thi se xoa log trong 14 ngay
      level: 'error',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        formatPrint,
      ),
    });

    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        formatPrint,
      ),
      transports: [
        // new transports.Console(),
        transportDailyErrorFile,
        transportDailyInfoFile,
      ],
    });
  }
  commonParams(params: string | object | any[]): LogParam {
    let context: string | object, requestId: string, metadata: object;
    if (!Array.isArray(params)) context = params;
    else [context, requestId, metadata] = params;

    return {
      requestId,
      context,
      metadata,
    };
  }

  log(message: string, params: object | any[]) {
    const logParam: LogParam = this.commonParams(params);
    const logObject = Object.assign(
      {
        message,
      },
      logParam,
    );

    this.logger.info(logObject);
  }

  error(message: string, params: object) {
    const logParam: LogParam = this.commonParams(params);
    const logObject: object = Object.assign(
      {
        message,
      },
      logParam,
    );

    console.log(logObject);

    this.logger.error(logObject);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
