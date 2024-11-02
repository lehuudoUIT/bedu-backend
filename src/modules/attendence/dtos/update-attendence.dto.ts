import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendenceDto } from './create-attendence.dto';

export class UpdateAttendenceDto extends PartialType(CreateAttendenceDto) {}
