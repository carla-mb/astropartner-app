import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { EventDTO } from '../models/event.dto';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://astropartner-api.onrender.com/events';

  // Subject to notify when an event is added, updated or deleted
  private eventChangedSource = new Subject<void>();
  eventChanged$ = this.eventChangedSource.asObservable();

  constructor(private http: HttpClient) {}

  notifyEventChange(): void {
    this.eventChangedSource.next();
  }

  getEventsByUser(userId: string): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`https://astropartner-api.onrender.com/users/${userId}/events`);
  }

  getEventById(eventId: string): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.apiUrl}/${eventId}`);
  }

  newEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.post<EventDTO>(this.apiUrl, event).pipe(
      tap(() => this.notifyEventChange()) 
    );
  }

  updateEvent(eventId: string, event: EventDTO): Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.apiUrl}/${eventId}`, event).pipe(
      tap(() => this.notifyEventChange())
    );
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`).pipe(
      tap(() => this.notifyEventChange()) 
    );
  }
}
