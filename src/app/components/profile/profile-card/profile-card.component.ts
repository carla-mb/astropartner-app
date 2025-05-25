import { Component, Input } from '@angular/core';
import { UserDTO } from '../../../models/user.dto';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { getUserAvatar } from '../../../utils/avatar';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-card',
  imports: [
    CommonModule, 
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() user: UserDTO | null = null;

  constructor(private router: Router) {}

  getUserAvatar = getUserAvatar;

  getZodiacRange(zodiacSign: string | undefined): string {
    return ({
      aries: 'Born between 21/03 and 19/04',
      taurus: 'Born between 20/04 and 20/05',
      gemini: 'Born between 21/05 and 20/06',
      cancer: 'Born between 21/06 and 22/07',
      leo: 'Born between 23/07 and 22/08',
      virgo: 'Born between 23/08 and 22/09',
      libra: 'Born between 23/09 and 22/10',
      scorpio: 'Born between 23/10 and 21/11',
      sagittarius: 'Born between 22/11 and 21/12',
      capricorn: 'Born between 22/12 and 19/01',
      aquarius: 'Born between 20/01 and 18/02',
      pisces: 'Born between 19/02 and 20/03'
    }[zodiacSign!] || '');
  }

  onEditProfile() {
    this.router.navigate(['/profile/edit']);
  }

  onEditPassword(): void {
    this.router.navigate(['/profile/edit-password']);
  }
}
