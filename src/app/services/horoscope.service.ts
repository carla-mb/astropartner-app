import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HoroscopeDTO } from '../models/horoscope.dto';

@Injectable({
  providedIn: 'root'
})
export class HoroscopeService {
  private apiUrl = 'https://astropartner-api.onrender.com/horoscope';

  constructor(private http: HttpClient) {}

  getHoroscope(zodiacSign: string): Observable<HoroscopeDTO> {
    return this.http.get<HoroscopeDTO>(`${this.apiUrl}/${zodiacSign}`);
  }
}
