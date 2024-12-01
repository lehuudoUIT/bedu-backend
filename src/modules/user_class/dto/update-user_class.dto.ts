import { PartialType } from '@nestjs/mapped-types';
import { CreateUserClassDto } from './create-user_class.dto';

export class UpdateUserClassDto extends PartialType(CreateUserClassDto) {}
