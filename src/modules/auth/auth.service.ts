import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';

import { AuthInput, AuthResult, SignInData } from '../../utils/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authentication(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) throw new UnauthorizedException();

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const userResponse = await this.usersService.findUserByUsername(input.username);
    const user = Array.isArray(userResponse.data) 
                  ? userResponse.data[0] 
                  : userResponse.data;

    if (user && user.password === input.password)
      return {
        userId: user.id,
        username: user.username,
      };
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return {
      ...user,
      accessToken,
    };
  }
}
