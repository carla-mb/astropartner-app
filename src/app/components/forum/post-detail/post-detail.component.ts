import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { PostDTO } from '../../../models/post.dto';
import { CommentDTO } from '../../../models/comment.dto';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommentService } from '../../../services/comment.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-detail',
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {
  post!: PostDTO;
  postUsername!: string;
  postZodiac!: string;
  postId!: string;
  // Each comment holds the original comment plus username and zodiacSign.
  comments: { comment: CommentDTO; username: string; zodiacSign: string }[] = [];
  commentContent: string = '';

  isAuthenticated: boolean = false;
  isOwner: boolean = false;
  currentUserId!: string;

  @Input() isMenuOpen = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.currentUserId = localStorage.getItem('userId')!;
    this.postId = this.route.snapshot.paramMap.get('id')!;

    // Fetch post detail with owner details
    this.postService.getPostById(this.postId).subscribe(post => {
      this.post = post;
      if (post.userId) {
        this.userService.getUserById(post.userId).subscribe(user => {
          this.postUsername = user.username;
          this.postZodiac = user.zodiacSign;
          // Determine ownership using the stored userId
          this.isOwner = this.currentUserId === post.userId;
        });
      }
    });
    this.loadComments();
  }

  loadComments(): void {
    this.postService.getCommentsByPostId(this.postId).subscribe((comms: CommentDTO[]) => {
      const enriched: { comment: CommentDTO; username: string; zodiacSign: string }[] = [];
      comms.forEach(comment => {
        this.userService.getUserById(comment.userId!).subscribe(user => {
          enriched.push({
            comment,
            username: user.username,
            zodiacSign: user.zodiacSign
          });
          if (enriched.length === comms.length) {
            this.comments = enriched;
          }
        });
      });
    });
  }

  submitComment(): void {
    if (this.commentContent.trim() === '') {
      return;
    }
    const newComment: CommentDTO = {
      commentContent: this.commentContent,
      commentDate: new Date(),
      postId: this.postId,
      userId: localStorage.getItem('user_id')! 
    };
    this.postService.addCommentToPost(this.postId, newComment).subscribe(comment => {
      this.userService.getUserById(comment.userId!).subscribe(user => {
        this.comments.push({
          comment,
          username: user.username,
          zodiacSign: user.zodiacSign
        });
      });
      this.commentContent = '';
    });
  }

  cancelComment(): void {
    this.commentContent = '';
  }

  editPost(): void {
    this.router.navigate(['/forum/post-form/edit', this.postId]);
  }

  deletePost(): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.postId).subscribe(() => {
        this.router.navigate(['/forum']);
      });
    }
  }

  editComment(commentId: string): void {
    const currentText = this.comments.find(entry => 
      entry.comment.commentId === commentId)?.comment.commentContent ?? '';
    const newContent = prompt('Edit your comment:', currentText);
    if (newContent && newContent.trim() !== '') {
      this.commentService.updateComment(commentId, {
        commentContent: newContent,
        commentDate: new Date(),
        postId: this.postId,
        userId: this.currentUserId
      }).subscribe(() => {
        this.comments = this.comments.map(entry =>
          entry.comment.commentId === commentId
            ? { ...entry, comment: { ...entry.comment, commentContent: newContent } }
            : entry
        );
      });
    }
  }

  deleteComment(commentId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe(() => {
        this.comments = this.comments.filter(commentData => commentData.comment.commentId !== commentId);
      });
    }
  }
  
  getUserAvatar(zodiacSign: string): string {
    return `/assets/images/zodiac/${zodiacSign}.png`;
  }
}
