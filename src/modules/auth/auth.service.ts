import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthInput, AuthResult, SignInData } from '../../utils';
import * as bcrypt from 'bcryptjs';
import { RoleService } from '../role/role.service';
var salt = bcrypt.genSaltSync(10);
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  async authentication(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) throw new UnauthorizedException();
    return await this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByUsername(input.username);
    if (!user) {
      throw new UnauthorizedException(
        'Username does not exist or password is not correct! [a]',
      );
    }
    //! verify password
    const verified = await bcrypt.compareSync(input.password, user.password);
    if (!verified)
      throw new UnauthorizedException(
        'Username does not exist or password is not correct! [b]',
      );

    delete user.password;

    if (user) return user;
    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const listUserGrant = await this.roleService.roleList(user.role.id);
    const accessToken = await this.jwtService.signAsync({
      ...user,
      grants: listUserGrant,
    });

    return {
      user,
      accessToken,
    };
  }
}
