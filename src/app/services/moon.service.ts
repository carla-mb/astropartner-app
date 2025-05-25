import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoonService {
  private backendUrl = 'https://astropartner-api.onrender.com/moon'; 

  constructor(private http: HttpClient) {}

  getTodayPhase(): Observable<any> {
    return this.http.get<any>(this.backendUrl); 
  }

  getMoonPhases(): Observable<number[]> {
    return this.http.get<any>(this.backendUrl).pipe(
      map(response => response.days.map((d: any) => d.moonphase))
    );
  }

  getMoonPhaseLabel(phase: number): string {
    if (phase === 0) return 'New Moon';
    else if (phase > 0 && phase < 0.25) return 'Waxing Crescent';
    else if (phase === 0.25) return 'First Quarter';
    else if (phase > 0.25 && phase < 0.5) return 'Waxing Gibbous';
    else if (phase === 0.5) return 'Full Moon';
    else if (phase > 0.5 && phase < 0.75) return 'Waning Gibbous';
    else if (phase === 0.75) return 'Last Quarter';
    else if (phase > 0.75 && phase < 1) return 'Waning Crescent';
    else return 'Unknown';
  }  
}
