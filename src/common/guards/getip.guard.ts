import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ClientIpGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Lấy IP từ header hoặc socket
    const clientIp =
      request.headers['x-forwarded-for']?.split(',')[0] || // Lấy IP đầu tiên (nếu qua proxy)
      request.socket.remoteAddress; // IP từ kết nối

    // Gắn IP vào request để các controller khác có thể sử dụng
    request.clientIp = clientIp?.replace(/^::ffff:/, ''); // Xử lý IPv4 mapped IPv6 nếu có
    console.log(clientIp);

    return true; // Guard luôn cho phép tiếp tục
  }
}
