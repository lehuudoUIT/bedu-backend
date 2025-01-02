import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { GoogleService } from './google.service';
import { CreateRecurringMeetingDto } from './dtos/create-calendar.dto';
import * as moment from 'moment';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}
  @Post('create-calendar')
  async createCalendar(@Body() body: { summary: string; description: string }) {
    const calendar = await this.googleService.createCalendar(
      body.summary,
      body.description,
    );
    return { message: 'Calendar created successfully', metadata: calendar };
  }

  @Post('create-recurring-event')
  async createRecurringEvent(
    @Body()
    body: {
      calendarId: string;
      summary: string;
      description: string;
      startDate: string; // Ngày bắt đầu do người dùng chọn
      startTime: string; // Giờ bắt đầu (HH:mm)
      endTime: string; // Giờ kết thúc (HH:mm)
      selectedDays: string[]; // ['Mon', 'Wed', 'Fri']
      lessonQuantity: number; // Số tuần lặp lại
      attendees: { email: string }[];
    },
  ) {
    try {
      // Tạo sự kiện
      const event = await this.googleService.createRecurringEvent(body);

      // {
      //   summary: body.summary,
      //   description: body.description,
      //   startDateTime,
      //   endDateTime,
      //   recurrence,
      //   attendees: body.attendees,
      // },

      return { message: 'Event created successfully', metadata: event };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':calendarId')
  async deleteCalendar(@Param('calendarId') calendarId: string) {
    try {
      await this.googleService.deleteCalendar(calendarId);
      return { message: 'Calendar deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':calendarId/events/:eventId')
  async deleteEvent(
    @Param('calendarId') calendarId: string,
    @Param('eventId') eventId: string,
  ) {
    try {
      await this.googleService.deleteEvent(calendarId, eventId);
      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':calendarId/events/ids')
  async getEventIds(@Param('calendarId') calendarId: string) {
    try {
      const eventIds = await this.googleService.listEvents(calendarId);
      return { message: 'Get list event successfully', metadata: eventIds };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':calendarId/share')
  async shareCalendar(
    @Param('calendarId') calendarId: string,
    @Body('email') email: string,
  ) {
    try {
      const acl = await this.googleService.shareCalendar(calendarId, email);
      return {
        message: 'Calendar shared successfully',
        metatdata: acl,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('detail/:calendarId/:eventId')
  async getEventDetails(
    @Param('calendarId') calendarId: string,
    @Param('eventId') eventId: string,
  ) {
    try {
      const eventDetails = await this.googleService.getEventDetails(
        calendarId,
        eventId,
      );
      return {
        message: 'Event details fetched successfully',
        metadata: eventDetails,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('publish-record')
  async shareFile(@Body('fileId') fileId: string) {
    try {
      const result = await this.googleService.setFilePublic(fileId);
      return {
        message: 'Publish file successfully!',
        metadata: result,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
