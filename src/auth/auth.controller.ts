import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportJwtGuard } from 'src/common/guards/passport.jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('login')
  login(@Body() input: { username: string; password: string }) {
    return this.authservice.authentication(input);
  }

  @Get('test-author')
  testAuthor(@Request() request) {
    return request.user;
  }

  @UseGuards(PassportJwtGuard)
  @Get('test-author-passport')
  testAuthorPassport(@Request() request) {
    return request.user;
  }
}
