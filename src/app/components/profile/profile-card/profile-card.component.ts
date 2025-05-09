import { Component, Input } from '@angular/core';
import { UserDTO } from '../../../models/user.dto';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-profile-card',
  imports: [CommonModule, MatCardModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() user: UserDTO | null = null;

  getUserAvatar(zodiacSign: string | undefined): string {
    if (!zodiacSign) {
      return '/assets/images/icons/avatar.png';
    }
    return `/assets/images/zodiac/${zodiacSign}.png`;
  }
}
