import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { EventDTO } from '../../../models/event.dto';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent, EventDialogData } from '../event-dialog/event-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { formatDateForDisplay } from '../../../utils/format-date.utils';

@Component({
  selector: 'app-planned-events',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './planned-events.component.html',
  styleUrl: './planned-events.component.scss'
})
export class PlannedEventsComponent implements OnInit {
  events: EventDTO[] = [];
  currentUserId = '';
  isAuthenticated = false;

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
    }
  }

  loadEvents(): void {
    this.eventService.getEventsByUser(this.currentUserId).subscribe(
      (events: EventDTO[]) => {
        const today = new Date();
        // Set today to the beginning of the day
        today.setHours(0, 0, 0, 0);
        this.events = events.filter(event => {
          const eventStart = new Date(event.start);
          return eventStart >= today;
        });
      },
      err => console.error('Error loading events:', err)
    );
  }
 
  updateEvent(event: EventDTO): void {
    // Open the EventDialogComponent in edit mode with the event pre-filled
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '300px',
      data: { clickedDate: formatDateForDisplay(event.start), event: event } as EventDialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the event
        this.eventService.updateEvent(event.eventId!, result).subscribe(
          updatedEvent => {
            console.log('Event updated:', updatedEvent);
            this.loadEvents();
          },
          err => console.error('Error updating event:', err)
        );
      }
    });
  }

  deleteEvent(event: EventDTO): void {
    if (event.eventId) {
      this.eventService.deleteEvent(event.eventId).subscribe(
        () => {
          console.log('Event deleted');
          this.loadEvents();
        },
        err => console.error('Error deleting event:', err)
      );
    }
  }
}
