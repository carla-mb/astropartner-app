import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UserDTO } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { DeleteProfileComponent } from './delete-profile/delete-profile.component';
import { RecentActivityComponent } from './recent-activity/recent-activity.component';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    ProfileCardComponent,
    RecentActivityComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: UserDTO | null = null;
  userId!: string;

  @Input() isMenuOpen = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    // Retrieve current userId from local storage
    this.userId = localStorage.getItem('userId') ?? '';
    if (!this.userId) {
      console.error('No userId found!');
      return;
    }
    this.loadUser();
  }

  loadUser() {
    this.userService.getUserById(this.userId).subscribe({
      next: (userData) => this.user = userData,
      error: (err) => console.error('Error getting user data: ', err)
    });
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeleteProfileComponent, {
      width: '300px'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.deleteUser(this.userId).subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['/home']);
          },
          error: (err) => console.error('Error during deletion: ', err)
        });
      } 
    });
  }

  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }
}
