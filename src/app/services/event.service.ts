import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDTO } from '../models/event.dto';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://astropartner-api.onrender.com/events';

  constructor(private http: HttpClient) {}

  getEventsByUser(userId: string): Observable<EventDTO[]> {
    return this.http.get<EventDTO[]>(`https://astropartner-api.onrender.com/users/${userId}/events`);
  }

  getEventById(eventId: string): Observable<EventDTO> {
    return this.http.get<EventDTO>(`${this.apiUrl}/${eventId}`);
  }

  newEvent(event: EventDTO): Observable<EventDTO> {
    return this.http.post<EventDTO>(this.apiUrl, event);
  }

  updateEvent(eventId: string, event: EventDTO): Observable<EventDTO> {
    return this.http.put<EventDTO>(`${this.apiUrl}/${eventId}`, event);
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
  }
}
