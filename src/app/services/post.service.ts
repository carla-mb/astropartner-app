import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostDTO } from '../models/post.dto';
import { CommentDTO } from '../models/comment.dto';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://astropartner-api.onrender.com/posts';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(this.apiUrl);
  }

  getPostsByUserId(userId: string): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(`https://astropartner-api.onrender.com/users/${userId}/posts`);
  }

  createPost(post: PostDTO): Observable<PostDTO> {
    return this.http.post<PostDTO>(this.apiUrl, post);
  }

  getPostById(postId: string): Observable<PostDTO> {
    return this.http.get<PostDTO>(`${this.apiUrl}/${postId}`);
  }

  updatePost(postId: string, post: PostDTO): Observable<PostDTO> {
    return this.http.put<PostDTO>(`${this.apiUrl}/${postId}`, post);
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`);
  }

  // Fetch all comments for a specific post
  getCommentsByPostId(postId: string): Observable<CommentDTO[]> {
    return this.http.get<CommentDTO[]>(`${this.apiUrl}/${postId}/comments`);
  }

  addCommentToPost(postId: string, comment: CommentDTO): Observable<CommentDTO> {
    return this.http.post<CommentDTO>(`${this.apiUrl}/${postId}/comments`, comment);
  }
}
