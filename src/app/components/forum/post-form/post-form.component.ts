import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { PostDTO } from '../../../models/post.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-form',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss'
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  postId?: string;
  isEditMode = false;
  originalPostDate?: Date;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.postForm = this.fb.group({
      postTitle: ['', Validators.required],
      postContent: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.postId) {
      this.isEditMode = true;
      this.postService.getPostById(this.postId).subscribe(post => {
        this.originalPostDate = post.postDate; 
        this.postForm.patchValue({
          postTitle: post.postTitle,
          postContent: post.postContent
        });
      });
    }
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;

    const post: PostDTO = {
      postTitle: this.postForm.value.postTitle,
      postContent: this.postForm.value.postContent,
      postDate: this.isEditMode && this.originalPostDate ? this.originalPostDate : new Date(),
    };

    if (this.isEditMode && this.postId) {
      this.postService.updatePost(this.postId, post).subscribe(() => {
        this.router.navigate([`/forum/post-detail`, this.postId]);
      });
    } else {
      this.postService.createPost(post).subscribe(() => {
        this.router.navigate(['/forum']);
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
