import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../models/user.dto';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { HoroscopeComponent } from './horoscope/horoscope.component';
import { MoonComponent } from './moon/moon.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    HoroscopeComponent,
    MoonComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentUser: UserDTO | null = null;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    if (this.isAuthenticated) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.userService.getUserById(userId).subscribe(
          (userData: UserDTO) => {
            this.currentUser = userData;
          },
          err => console.error('Error fetching user details', err)
        );
      }
    }
  }
}
