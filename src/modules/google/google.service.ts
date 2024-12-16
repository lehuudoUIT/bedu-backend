import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT } from 'google-auth-library';
import { google, calendar_v3 } from 'googleapis';

@Injectable()
export class GoogleService {
  private calendar: calendar_v3.Calendar;
  private authClient;

  constructor(private readonly configService: ConfigService) {
    const private_key = configService
      .getOrThrow('GOOGLE_PRIVATE_KEY')
      .replace(/\\n/g, '\n');

    const client_email = configService.getOrThrow('GOOGLE_CLIENT_EMAIL');
    this.authClient = this.authenticateGoogleServiceAccount(
      client_email,
      private_key,
    );

    this.calendar = google.calendar({ version: 'v3', auth: this.authClient });
  }

  private authenticateGoogleServiceAccount(
    client_email: string,
    private_key: string,
  ): JWT {
    // Create an OAuth2 client (JWT) to authenticate the service account
    const authClient = new google.auth.JWT(
      client_email,
      undefined,
      private_key,
      [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      'beduadmin@buoi-edu.shop', // The user to impersonate (this is required for domain-wide delegation)
    );

    return authClient;
  }

  async createRecurringMeeting(
    summary: string = 'BEDU-01', // Event summary (name)
    startTime: string, // Start time (e.g., '18:00:00' for 6 PM)
    endTime: string, // End time (e.g., '20:00:00' for 8 PM)
    daysOfWeek: string[], // Days of the week for recurrence (e.g., ['MO', 'TH', 'FR'])
    startDate: Date, // Start date for the first occurrence
    timeZone: string = 'UTC', // Optional: Default to UTC, but can be customized
    attendees: { email: string; displayName?: string }[] = [],
  ) {
    // Set the start date and time for the first occurrence
    const startDateTime = new Date(startDate);
    const [hours, minutes] = startTime.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0); // Set the specified start time

    const endDateTime = new Date(startDateTime.getTime());
    const [endHours, endMinutes] = endTime.split(':');
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0); // Set the specified end time

    // Format times in ISO 8601 format
    const startIso = startDateTime.toISOString();
    const endIso = endDateTime.toISOString();

    // Set recurrence rule for the specified days
    const recurrenceRule = `RRULE:FREQ=WEEKLY;BYDAY=${daysOfWeek.join(',')}`;

    // Event object to send to the API
    const event = {
      summary, // Event summary (e.g., "Weekly Meeting")
      description: 'Recurring meeting event.',
      start: {
        dateTime: startIso,
        timeZone,
      },
      end: {
        dateTime: endIso,
        timeZone,
      },
      recurrence: [recurrenceRule],
      attendees: attendees.map((attendee) => ({
        email: attendee.email,
        displayName: attendee.displayName, // Optional: Display name if provided
      })),
    };

    try {
      // Correct method signature for inserting events
      const response = await this.calendar.events.insert({
        calendarId: 'primary', // calendarId should be passed as a parameter
        requestBody: event, // The actual event details
      });

      console.log('Recurring event created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error.message);
      throw new Error('Failed to create recurring event');
    }
  }
}
