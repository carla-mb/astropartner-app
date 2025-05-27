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
import { MoonPhasesComponent } from './moon-phases/moon-phases.component';

@Component({
  selector: 'app-calendar',
  imports: [
    FullCalendarModule,
    CommonModule,
    MatButtonModule,
    MatCardModule, 
    RouterModule,
    PlannedEventsComponent,
    MoonPhasesComponent
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
      left: 'prev',
      center: 'title',
      right: 'today next'
    },
    displayEventTime: false,
    eventDisplay: 'block', 
    dateClick: this.handleDateClick.bind(this),   
    eventClick: this.handleEventClick.bind(this),
    events: [],
    firstDay: 1, 
    eventOrder: "start,end,title"            
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
      this.loadEvents();
      this.eventService.eventChanged$.subscribe(() => this.loadEvents());
    }
  }

  // Loads events from the backend and update FullCalendar's events
  loadEvents(): void {
    this.eventService.getEventsByUser(this.currentUserId).subscribe(
      (events: EventDTO[]) => {
        this.calendarOptions.events = events.map(e => ({
          id: e.eventId,
          title: e.title,
          start: e.start,
          end: e.end,
          color: e.color || '#9357c7'
        }));
      },
    );
  }

  // Triggered when a day is clicked in the calendar
  handleDateClick(arg: any): void {
    if (!this.isAuthenticated) { return; }
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { clickedDate: arg.dateStr } as EventDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create the new event object using the color provided
        const newEvent: EventDTO = {
          title: result.title,
          start: result.start,
          end: result.end,
          color: result.color,
          userId: this.currentUserId
        };
        this.eventService.newEvent(newEvent).subscribe(
          () => this.loadEvents(),
        );
      }
    });
  }

  // Triggered when an event is clicked in the calendar (edit mode)
  handleEventClick(arg: any): void {
    if (!this.isAuthenticated) { return; }

    const e = arg.event;
    const dto: EventDTO = {
      eventId: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      color: e.backgroundColor || '#9357c7',
      userId: this.currentUserId
    };

    this.openEventDialog(dto);
  }

  public openEventDialog(eventData: EventDTO): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { event: eventData } as EventDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      if (result.action === 'delete') {
        this.eventService.deleteEvent(eventData.eventId!).subscribe(
          () => this.loadEvents(),
        );
      } else if (result.action === 'update') {
        const updated: EventDTO = {
          ...result.eventData,
          userId: this.currentUserId
        };
        this.eventService.updateEvent(eventData.eventId!, updated).subscribe(
          () => this.loadEvents(),
        );
      }
    });
  }
}
