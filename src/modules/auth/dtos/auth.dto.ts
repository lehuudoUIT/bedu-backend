import { IsNotEmpty } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  birthday: Date;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
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
