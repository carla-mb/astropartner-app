import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../models/user.dto';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://astropartner-api.onrender.com/users';

  constructor(private http: HttpClient) {}

  register(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiUrl, user).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  getUserById(userId: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/${userId}`);
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/${userId}`, user).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
