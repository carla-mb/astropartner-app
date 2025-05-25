import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from '../../../models/user.dto';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule, Router } from '@angular/router';
import { formatDateForAPI } from '../../../utils/date-formatting';

@Component({
  selector: 'app-edit-profile',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  editForm: FormGroup;
  apiError: string | null = null;
  private userId: string | null = null;
  private existingPassword!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      username: [
        '', 
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-z][a-z0-9_]*$')
        ]
      ],
      birthDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (data: UserDTO) => {
          // Cache the current password from the fetched data.
          this.existingPassword = data.password;

          this.editForm.patchValue({
            username: data.username.toLowerCase(),
            birthDate: formatDateForAPI(new Date(data.birthDate)),
          });
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
    } else {
      console.error('No userId found. Redirecting to login.');
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (!this.editForm.valid) return;
    let { username, birthDate } = this.editForm.value;
    username = username.trim();

    // Format birth date
    const rawDate = new Date(this.editForm.get('birthDate')?.value);
    birthDate = formatDateForAPI(rawDate); 

    // Check that userId is available to proceed
    if (!this.userId) {
      console.error('User ID not found.');
      return;
    }

    const updatedUser = new UserDTO(username, this.existingPassword, birthDate, '');

    this.userService.updateUser(this.userId, updatedUser).subscribe({
      next: (response: any) => {
        console.log('Profile updated successfully:', response);
        this.router.navigate(['/profile']);
      },
      error: (err: any) => {        
        if (err.status === 400 && err.error.message === 'Username already exists') {
          this.editForm.get('username')?.setErrors({ usernameExists: true });
        } else {
          this.apiError = 'Failed to update profile. Please try again.';
          console.error('Update error:', err);
        }
      },
    });
  }
  
  forceLowercase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toLowerCase();
    this.editForm.get('username')?.setValue(input.value, { emitEvent: false });
  }
}
