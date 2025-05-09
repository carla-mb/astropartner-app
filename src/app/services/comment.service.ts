import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDTO } from '../models/comment.dto';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'https://astropartner-api.onrender.com/comments';

  constructor(private http: HttpClient) {}

  getCommentById(commentId: string): Observable<CommentDTO> {
    return this.http.get<CommentDTO>(`${this.apiUrl}/${commentId}`);
  }

  updateComment(commentId: string, comment: CommentDTO): Observable<CommentDTO> {
    return this.http.put<CommentDTO>(`${this.apiUrl}/${commentId}`, comment);
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
  }
}
