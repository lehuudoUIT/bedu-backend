import {
  IsString,
  IsArray,
  IsDateString,
  IsOptional,
  IsEmail,
  IsObject,
} from 'class-validator';

class AttendeeDto {
  @IsEmail()
  email: string; // The email address of the attendee

  @IsOptional()
  @IsString()
  displayName?: string; // Optional: The display name of the attendee
}

export class CreateRecurringMeetingDto {
  @IsString()
  summary: string; // Event summary (e.g., "Team Meeting")

  @IsString()
  startTime: string; // Start time (e.g., '18:00:00' for 6 PM)

  @IsString()
  endTime: string; // End time (e.g., '20:00:00' for 8 PM)

  @IsArray()
  @IsString({ each: true })
  daysOfWeek: string[]; // Days of the week for recurrence (e.g., ['MO', 'TH', 'FR'])

  @IsDateString()
  startDate: string; // Start date for the first occurrence (ISO string format)

  @IsOptional()
  @IsString()
  timeZone: string = 'UTC'; // Optional: Timezone, default is 'UTC'

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  attendees?: AttendeeDto[]; // Optional: List of attendees (email and display name)
}
