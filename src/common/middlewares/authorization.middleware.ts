import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  private excludedRoutes = ['/auth/login', '/auth/signup']; // Các route cần bỏ qua
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.path);

    if (this.excludedRoutes.includes(req.path)) {
      console.log('Miễn nghĩa vụ QS');

      return next(); // Bỏ qua middleware cho các route được loại trừ
    }

    const token = req.headers.authorization?.split(' ')[1] || req.cookies.jwt;

    if (!token) throw new UnauthorizedException('User is not authorized! [M]');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      console.error('Invalid token:', error.message);
      throw new UnauthorizedException(error.message);
    }

    console.log(`Đi qua hải quan: ${req.originalUrl}`);
    // Thực hiện logic middleware tại đây
    next();
  }
}
