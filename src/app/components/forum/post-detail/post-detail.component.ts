import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { PostDTO } from '../../../models/post.dto';
import { CommentDTO } from '../../../models/comment.dto';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CommentsListComponent } from '../comments-list/comments-list.component';
import { getUserAvatar } from '../../../utils/avatar';

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
    MatIconModule,
    CommentsListComponent
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
    private router: Router,
    private dialog: MatDialog
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
  }

  editPost(): void {
    this.router.navigate(['/forum/post-form/edit', this.postId]);
  }

  deletePost(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this post? This action cannot be undone.' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postService.deletePost(this.postId).subscribe(() => {
          this.router.navigate(['/forum']);
        });
      }
    });
  }

  getUserAvatar = getUserAvatar;
}
