import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT } from 'google-auth-library';
import { google, calendar_v3, drive_v3 } from 'googleapis';
import * as moment from 'moment';

@Injectable()
export class GoogleService {
  private calendar: calendar_v3.Calendar;
  private drive: drive_v3.Drive;

  constructor(private readonly configService: ConfigService) {
    //* Lấy key cần thiết
    const private_key = configService
      .getOrThrow('GOOGLE_PRIVATE_KEY')
      .replace(/\\n/g, '\n');
    const impersonateEmail = this.configService.getOrThrow(
      'GOOGLE_IMPERSONATED_EMAIL',
    );
    const client_email = configService.getOrThrow('GOOGLE_CLIENT_EMAIL');

    //* Lấy token
    const auth = new google.auth.JWT(
      client_email,
      undefined,
      private_key,
      [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/drive',
      ],
      impersonateEmail, // The user to impersonate (this is required for domain-wide delegation)
    );

    //* Tạo calendar client
    this.calendar = google.calendar({ version: 'v3', auth });
    this.drive = google.drive({ version: 'v3', auth });
  }

  async createCalendar(
    summary: string,
    description: string,
  ): Promise<calendar_v3.Schema$Calendar> {
    const calendar = {
      summary,
      description,
      timeZone: 'Asia/Ho_Chi_Minh', // Timezone mặc định
    };

    const res = await this.calendar.calendars.insert({
      requestBody: calendar,
    });

    return res.data;
  }

  generateRecurrenceRule(
    selectedDays: string[],
    lessonQuantity: number,
  ): string {
    const daysMapping: Record<string, string> = {
      Mon: 'MO',
      Tue: 'TU',
      Wed: 'WE',
      Thu: 'TH',
      Fri: 'FR',
      Sat: 'SA',
      Sun: 'SU',
    };

    // Chuyển đổi danh sách ngày thành định dạng RRULE
    const byDay = selectedDays.map((day) => daysMapping[day]).join(',');

    // Tạo RRULE
    return `RRULE:FREQ=WEEKLY;COUNT=${lessonQuantity};BYDAY=${byDay}`;
  }

  validateAndAdjustStartDate(
    startDate: string,
    selectedDays: string[],
  ): string {
    const daysMapping: Record<string, string> = {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun',
    };

    const startDayOfWeek = moment(startDate).format('dddd'); // Lấy thứ của ngày bắt đầu (ví dụ: "Tuesday")
    const startDayAbbr = daysMapping[startDayOfWeek]; // Chuyển thành dạng viết tắt ("Tue")

    if (!selectedDays.includes(startDayAbbr)) {
      throw new BadRequestException(
        `Thứ của ngày bắt đầu (${startDate} - ${startDayOfWeek}) không nằm trong danh sách các thứ được chọn: ${selectedDays.join(', ')}.`,
      );
    }

    return startDate;
  }

  async createRecurringEvent(body: {
    calendarId: string;
    summary: string;
    description: string;
    startDate: string; // Ngày bắt đầu do người dùng chọn
    startTime: string; // Giờ bắt đầu (HH:mm)
    endTime: string; // Giờ kết thúc (HH:mm)
    selectedDays: string[]; // ['Mon', 'Wed', 'Fri']
    lessonQuantity: number; // Số tuần lặp lại
    attendees: { email: string }[];
  }): Promise<calendar_v3.Schema$Event> {
    // Kết hợp startDate và startTime thành startDateTime
    const startDateTime = moment(
      `${body.startDate} ${body.startTime}`,
    ).toISOString();

    const endDateTime = moment(
      `${body.startDate} ${body.endTime}`,
    ).toISOString();

    // Kiểm tra ngày bắt đầu có hợp lệ không
    this.validateAndAdjustStartDate(body.startDate, body.selectedDays);

    // Tạo RRULE từ selectedDays và weeks
    const recurrence = [
      this.generateRecurrenceRule(body.selectedDays, body.lessonQuantity),
    ];

    const event = {
      summary: body.summary,
      description: body.description,
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Ho_Chi_Minh',
      },
      recurrence,
      attendees: body.attendees,
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`, // Unique request ID
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const res = await this.calendar.events.insert({
      calendarId: body.calendarId,
      requestBody: event,
      conferenceDataVersion: 1, // Bắt buộc để tạo Google Meet link
    });

    return res.data;
  }

  async shareCalendar(calendarId: string, userEmail: string): Promise<any> {
    try {
      const response = await this.calendar.acl.insert({
        calendarId,
        requestBody: {
          scope: {
            type: 'user', // Loại đối tượng (user, group, domain, hoặc default)
            value: userEmail, // Email của người dùng
          },
          role: 'reader', // Quyền truy cập
        },
      });

      return response.data; // Trả về thông tin quyền truy cập
    } catch (error) {
      throw new Error(`Lỗi khi chia sẻ calendar: ${error.message}`);
    }
  }

  async deleteCalendar(calendarId: string): Promise<void> {
    try {
      await this.calendar.calendars.delete({
        calendarId,
      });
    } catch (error) {
      throw new Error(`Lỗi khi xóa calendar: ${error.message}`);
    }
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch (error) {
      throw new Error(`Lỗi khi xóa sự kiện: ${error.message}`);
    }
  }

  async listEvents(
    calendarId: string,
  ): Promise<{ id: string; startTime: string; endTime: string }[]> {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        maxResults: 100, // Giới hạn số lượng sự kiện, bạn có thể thay đổi tùy ý
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      return events.map((event) => {
        return {
          id: event.id,
          startTime: event.start.dateTime,
          endTime: event.end.dateTime,
        };
      });
    } catch (error) {
      throw new Error(`Lỗi khi lấy danh sách sự kiện: ${error.message}`);
    }
  }

  async getEventDetails(calendarId: string, eventId: string): Promise<any> {
    try {
      const response = await this.calendar.events.get({
        calendarId,
        eventId,
      });
      return response.data; // Trả về thông tin chi tiết của sự kiện
    } catch (error) {
      throw new Error(`Lỗi khi lấy thông tin sự kiện: ${error.message}`);
    }
  }

  async setFilePublic(fileId: string): Promise<any> {
    try {
      // Tạo quyền truy cập cho "anyone" với quyền "reader"
      await this.drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone', // Bất kỳ ai có link đều có thể xem
        },
      });

      // Lấy thông tin file sau khi thay đổi quyền
      const file = await this.drive.files.get({
        fileId,
        fields: 'id, name, webViewLink, webContentLink',
      });

      return file.data.webViewLink;
    } catch (error) {
      throw new Error(`Failed to update file permission: ${error.message}`);
    }
  }
}
