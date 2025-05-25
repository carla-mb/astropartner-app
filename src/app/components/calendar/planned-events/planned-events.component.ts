import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event.service';
import { AuthService } from '../../../services/auth.service';
import { EventDTO } from '../../../models/event.dto';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-planned-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIcon,
    MatTooltipModule
  ],
  templateUrl: './planned-events.component.html',
  styleUrl: './planned-events.component.scss'
})
export class PlannedEventsComponent implements OnInit {
  events: EventDTO[] = [];
  currentUserId = '';
  isAuthenticated = false;

  @Output() manageEvent = new EventEmitter<EventDTO>();

  constructor(
    private eventService: EventService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      this.currentUserId = localStorage.getItem('userId')!;
      this.loadEvents();
      this.eventService.eventChanged$.subscribe(() => this.loadEvents());
    }
  }

  // Load events in the same order as in the CalendarOption
  loadEvents(): void {
    const compareDates = (a: Date, b: Date) => a.getTime() - b.getTime();

    this.eventService.getEventsByUser(this.currentUserId).subscribe(
      (events: EventDTO[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.events = events
          .filter(e => new Date(e.start) >= today)
          .sort((a, b) => {
            return (
              compareDates(new Date(a.start), new Date(b.start)) ||
              compareDates(new Date(a.end), new Date(b.end)) ||
              a.title.localeCompare(b.title)
            );
          })
          .slice(0, 6);
      },
      err => console.error('Error loading events:', err)
    );
  }

  manageClickedEvent(event: EventDTO): void {
    this.manageEvent.emit(event);
  }
}
