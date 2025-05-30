import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { RouterModule, Router } from '@angular/router';
import { UserDTO } from '../../models/user.dto';
import { formatDateForAPI } from '../../utils/date-formatting';

@Component({
  selector: 'app-register',
  standalone: true,
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  apiError: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router,
    private location: Location 
  ) {
    this.registerForm = this.fb.group({
      username: ['', 
        [
          Validators.required, 
          Validators.minLength(3), 
          Validators.pattern('^[a-z][a-z0-9_]*$')
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      birthDate: ['', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(form: FormGroup): void {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return;

    if (confirmPassword.value !== password.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
  }

  onSubmit(): void {
    if (!this.registerForm.valid) return;
    
    let { username, password, birthDate } = this.registerForm.value;
    const rawDate = this.registerForm.get('birthDate')?.value;
    birthDate = formatDateForAPI(rawDate);
    const newUser = new UserDTO(username, password, birthDate, '');

    this.userService.register(newUser).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        if (err.status === 400 && err.error.message === 'Username already exists') {
          this.registerForm.get('username')?.setErrors({ usernameExists: true });
        }
      }
    });    
  }
  
  // Enforce lowercase in the input field
  forceLowercase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toLowerCase(); 
    this.registerForm.get('username')?.setValue(input.value, { emitEvent: false });
  }

  // Navigate to the previous page
  goBack(): void {
    this.location.back(); 
  }

  // Password field visibility
  showPassword = false;
  showConfirmPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
