import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { AuthDTO } from '../../models/auth.dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.loginForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,        
          Validators.minLength(3),    
        ],
      ],
      password: [
        '',
        [
          Validators.required,        
          Validators.minLength(6),    
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginError) {
        this.loginError = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    const authData = new AuthDTO('', '', this.loginForm.value.username, this.loginForm.value.password);

    this.authService.login(authData).subscribe({
      next: () => {
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.loginError = true; 
      },  
    });
  }

  // Navigate to the previous page
  goBack(): void {
    this.location.back(); 
  }

  // Password field visibility
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
