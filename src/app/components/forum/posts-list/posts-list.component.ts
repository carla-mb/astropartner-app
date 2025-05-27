import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PostDTO } from '../../../models/post.dto';
import { PostService } from '../../../services/post.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatButtonModule } from '@angular/material/button';
import { getUserAvatar } from '../../../utils/avatar';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-posts-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIcon, 
    MatProgressSpinner
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss'
})
export class PostsListComponent implements OnInit {
  posts: PostDTO[] = [];
  paginatedPosts: { post: PostDTO; username: string; zodiacSign: string }[] = [];
  fullPaginatedPosts: { post: PostDTO; username: string; zodiacSign: string }[] = [];
  pageSize: number = 5; 
  currentPage: number = 0;
  isAuthenticated: boolean = false; 

  @Input() isMenuOpen = false;

  constructor(
    private postsService: PostService,
    private usersService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication status
    this.isAuthenticated = this.authService.isLoggedIn(); 
    this.loadPosts();
  }

  loadPosts(): void {
    this.postsService.getAllPosts().subscribe(
      (data: PostDTO[]) => {
        // Store raw posts from API
        this.posts = data; 
        
        // Reset the list to prevent duplicate entries  
        this.paginatedPosts = [];
        let postsLoadedCount = 0;

        // Fetch username and zodiac sign for each post dynamically
        this.posts.forEach((post) => {
          if (post.userId) {
            this.usersService.getUserById(post.userId).subscribe(user => {
              this.postsService.getCommentsByPostId(post.postId!).subscribe(comments => {
                (post as any).commentCount = comments.length;
                
                this.paginatedPosts.push({
                  post,
                  username: user.username,
                  zodiacSign: user.zodiacSign,
                });
                postsLoadedCount++;
  
                // Check if all posts with userId have been fully loaded before sorting
                if (postsLoadedCount === this.posts.filter(p => p.userId).length) {
                  // Store the full list before applying pagination
                  this.fullPaginatedPosts = [...this.paginatedPosts];
                  // Sort posts by date and paginate the first page
                  this.paginatedPosts = this.fullPaginatedPosts
                    .sort((a, b) => new Date(b.post.postDate).getTime() - new Date(a.post.postDate).getTime())
                    .slice(0, this.pageSize);
                }
              });
            },
            );
          }
        });
      },
    );
  }
  
  onPaginate(event: any): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    // Always slice from the full list of posts
    this.paginatedPosts = this.fullPaginatedPosts.slice(startIndex, endIndex);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }
  
  createPost(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/forum/post-form']); 
    } else {
      this.router.navigate(['/auth/login']); 
    }
  }

  viewPost(postId: string): void {
    this.router.navigate(['/forum/post-detail', postId]); 
  }

  getUserAvatar = getUserAvatar;

  getCommentCount(post: PostDTO): number {
    return (post as any).commentCount || 0;
  }
}