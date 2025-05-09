import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventService } from '../../services/event.service';
import { EventDTO } from '../../models/event.dto';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router'; 
import { EventDialogComponent, EventDialogData } from './event-dialog/event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PlannedEventsComponent } from './planned-events/planned-events.component';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule,
    CommonModule,
    MatButtonModule,
    MatCardModule, 
    RouterModule,
    PlannedEventsComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  isAuthenticated = false;
  currentUserId = '';

  // FullCalendar configuration
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: ''
    },
    displayEventTime: false,
    dateClick: this.handleDateClick.bind(this),   
    events: []             
  };

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      this.currentUserId = localStorage.getItem('userId')!;
      this.calendarOptions.dateClick = this.handleDateClick.bind(this);
      this.loadEvents();
    }
  }

  // Loads events from the backend and update FullCalendar's events.
  loadEvents(): void {
    this.eventService.getEventsByUser(this.currentUserId).subscribe(
      (events: EventDTO[]) => {
        this.calendarOptions.events = events.map(e => ({
          id: e.eventId,
          title: e.title,
          start: e.start,
          end: e.end
        }));
      },
      err => console.error('Error loading events:', err)
    );
  }

  // Triggered when a day is clicked in the calendar
  handleDateClick(arg: any): void {
    if (!this.isAuthenticated) { return; }
    // Open event dialog component
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { clickedDate: arg.dateStr } as EventDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Construct a new EventDTO from the dialog result
        const newEvent: EventDTO = {
          title: result.title,
          start: result.start,
          end: result.end,
          userId: this.currentUserId
        };
        // Send the new event to the backend
        this.eventService.newEvent(newEvent).subscribe(
          () => {
            this.loadEvents();
          },
          err => console.error('Error creating event:', err)
        );
      }
    });
  }
}
