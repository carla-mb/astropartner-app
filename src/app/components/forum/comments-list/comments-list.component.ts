import { Component, Input, OnInit } from '@angular/core';
import { CommentDTO } from '../../../models/comment.dto';
import { PostService } from '../../../services/post.service'; 
import { CommentService } from '../../../services/comment.service'; 
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { getUserAvatar } from '../../../utils/avatar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-comments-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss'
})
export class CommentsListComponent implements OnInit {
  @Input() postId!: string;
  @Input() currentUserId!: string;

  isAuthenticated!: boolean;
  comments: { comment: CommentDTO; username: string; zodiacSign: string }[] = [];
  commentContent: string = '';
  
  isEditMode: string | null = null;
  editedCommentContent: string = '';

  getUserAvatar = getUserAvatar;

  constructor(
    private postService: PostService, 
    private commentService: CommentService, 
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.loadComments();
  }

  loadComments(): void {
    this.postService.getCommentsByPostId(this.postId).subscribe((comms: CommentDTO[]) => {
      const detailedComment: { comment: CommentDTO; username: string; zodiacSign: string }[] = [];
      
      comms.forEach(comment => {
        this.userService.getUserById(comment.userId!).subscribe(user => {
          detailedComment.push({
            comment,
            username: user.username,
            zodiacSign: user.zodiacSign
          });

          if (detailedComment.length === comms.length) {
            this.comments = detailedComment.sort((a, b) => 
              new Date(a.comment.commentDate).getTime() - new Date(b.comment.commentDate).getTime()
            );
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
      userId: this.currentUserId
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
      this.loadComments(); 
    });
  }

  // Clear input field
  cancelComment(): void {
    this.commentContent = ''; 
  }

  editComment(commentId: string): void {
    this.isEditMode = commentId;
    this.editedCommentContent = this.comments.find(entry => entry.comment.commentId === commentId)?.comment.commentContent ?? '';
  }

  saveEditedComment(commentId: string): void {
    if (this.editedCommentContent.trim() !== '') {
      const originalDateStr = this.comments.find(entry => entry.comment.commentId === commentId)?.comment.commentDate;
      const originalDate = originalDateStr ? new Date(originalDateStr) : new Date(); 

      this.commentService.updateComment(commentId, {
        commentContent: this.editedCommentContent,
        commentDate: originalDate, 
        postId: this.postId,
        userId: this.currentUserId
      }).subscribe(() => {
        this.comments = this.comments.map(entry =>
          entry.comment.commentId === commentId
            ? { ...entry, comment: { ...entry.comment, commentContent: this.editedCommentContent } }
            : entry
        );
        this.isEditMode = null;
      });
    }
  }

  cancelEdit(): void {
    this.isEditMode = null;
  }

  deleteComment(commentId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this comment? This action cannot be undone.' }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => { 
      if (result) {
        this.commentService.deleteComment(commentId).subscribe(() => {
          this.comments = this.comments.filter(commentData => commentData.comment.commentId !== commentId);
        });
      }
    });
  }
}
