import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportJwtGuard } from 'src/common/guards/passport.jwt.guard';
import { Response } from 'express';
import { SignUpDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('login')
  async login(
    @Body() input: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authservice.authentication(input);
    response.cookie('jwt', result.accessToken, {
      // httpOnly: true,
      maxAge: Number(process.env.JWT_EXPIRATION),
    });
    return {
      metadata: result,
      message: 'Login successfully',
    };
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const result = await this.authservice.signUp(signUpDto);
      return {
        metadata: result,
        message: 'Signup successfully!',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
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
