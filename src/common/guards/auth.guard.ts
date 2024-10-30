import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //* Extract accessToken from request (context)
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization; //* Bearer <Token>

    const token = authorization?.split(' ')[1];
    console.log(token);

    if (!token) throw new UnauthorizedException();
    //* Verify token
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token, {
        // secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      request.user = {
        userId: tokenPayload.sub,
        username: tokenPayload.username,
      };
      return true;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException();
    }
  }
}
