import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PostDTO } from '../../../models/post.dto';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-recent-activity',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './recent-activity.component.html',
  styleUrl: './recent-activity.component.scss'
})
export class RecentActivityComponent implements OnInit {
  @Input() userId!: string;
  posts: PostDTO[] = [];

  constructor(
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadPosts();
    }
  }

  loadPosts(): void {
    this.postService.getPostsByUserId(this.userId).subscribe({
      next: (posts: PostDTO[]) => {
        this.posts = posts.reverse();
        // Recover and count how many comments the post has
        this.posts.forEach(post => {
          this.postService.getCommentsByPostId(post.postId!).subscribe({
            next: (comments) => {
              (post as any).commentCount = comments.length;
            },
            error: (err) => console.error(`Error fetching comments for post ${post.postId}:`, err)
          });
        });        
      },
      error: (err) => console.error('Error fetching recent activity:', err)
    });
  }

  viewPost(postId: string | undefined): void {
    if (postId) {
      this.router.navigate(['/forum/post-detail', postId]);
    }
  }

  getCommentCount(post: PostDTO): number {
    return (post as any).commentCount || 0;
  }
}
