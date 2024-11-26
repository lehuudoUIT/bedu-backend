import { PartialType } from '@nestjs/mapped-types';
import { CreateUserProgramDto } from './create-user_program.dto';

export class UpdateUserProgramDto extends PartialType(CreateUserProgramDto) {}
