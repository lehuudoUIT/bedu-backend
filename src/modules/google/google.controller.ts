import { Body, Controller, Post } from '@nestjs/common';
import { GoogleService } from './google.service';
import { CreateRecurringMeetingDto } from './dtos/create-calendar.dto';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post('create-recurring-meeting')
  async createCalendarForUser(
    @Body() createRecurringMeetingDto: CreateRecurringMeetingDto,
  ) {
    const {
      summary,
      startTime,
      endTime,
      daysOfWeek,
      startDate,
      timeZone,
      attendees,
    } = createRecurringMeetingDto;

    // Parse startDate to a Date object
    const parsedStartDate = new Date(startDate);

    return await this.googleService.createRecurringMeeting(
      summary,
      startTime,
      endTime,
      daysOfWeek,
      parsedStartDate,
      timeZone || 'UTC', // Default to UTC if no timezone is provided
      attendees || [], // Default to an empty array if no attendees are provided
    );
  }
}
