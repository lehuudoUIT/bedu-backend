import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  sex: string;
  @IsNotEmpty()
  birthday: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  cid: string;

  @IsEmail()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  currentLevel: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
