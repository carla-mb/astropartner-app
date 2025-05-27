import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from '../../../models/user.dto';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-password',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.scss'
})
export class EditPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  apiError: string | null = null;
  private userId: string | null = null;
  // Cache fields from the current user so that they remain unchanged
  private existingUsername!: string;
  private existingBirthDate!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    // Build the form with newPassword and confirmPassword fields
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      // Retrieve the current user data to cache the non-password fields
      this.userService.getUserById(this.userId).subscribe({
        next: (data: UserDTO) => {
          this.existingUsername = data.username;
          this.existingBirthDate = data.birthDate;
        },
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    this.apiError = null;
    if (!this.passwordForm.valid) return;
    const { newPassword, confirmPassword } = this.passwordForm.value;

    // Check password mismatch and display error instead of allowing submission
    if (newPassword !== confirmPassword) {
      this.apiError = "Passwords do not match";
      return;
    }

    if (!this.userId) {
      return;
    }
    // Construct an updated user object using the new password and the cached data
    const updatedUser = new UserDTO(
      this.existingUsername,
      newPassword,
      this.existingBirthDate,
      ''
    );

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      },
      error: (err: any) => {
        this.apiError = 'Failed to update password. Please try again.';
      }
    });
  }

  // Password field visibility
  showNewPassword = false;
  showConfirmPassword = false;

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
