import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthDTO } from '../models/auth.dto';

export interface AuthService {
  userId: string;
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://astropartner-api.onrender.com/auth';

  constructor(private http: HttpClient, private router: Router) {}

  // On successful login store access_token and userId in local storage
  login(auth: AuthDTO): Observable<AuthService> {
    return this.http.post<AuthService>(this.apiUrl, auth).pipe(
      tap((token) => {
        localStorage.setItem('access_token', token.access_token);
        localStorage.setItem('userId', token.userId); 
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
  
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    this.router.navigate(['/home']);
  }  
}
