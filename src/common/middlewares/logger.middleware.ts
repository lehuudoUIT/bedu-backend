import { Request, Response, NextFunction } from 'express';
import { MyLoggerService } from 'src/logger/mylogger.log';
import { v4 as uuidv4 } from 'uuid';

const mylogger = new MyLoggerService();

export function logger(req: Request, res: Response, next: NextFunction) {
  const requestId: string | string[] = req.headers['x-request-id'] || uuidv4();
  req['requestId'] = requestId;
  mylogger.log(`${req.method} - input param`, [
    req.path,
    requestId,
    req.method === 'POST' ? req.body : req.query,
  ]);

  next();
}
