import { Component, Input } from '@angular/core';
import { HoroscopeDTO } from '../../../models/horoscope.dto';
import { HoroscopeService } from '../../../services/horoscope.service';
import { UserDTO } from '../../../models/user.dto';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { getUserAvatar } from '../../../utils/avatar';

@Component({
  selector: 'app-horoscope',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './horoscope.component.html',
  styleUrl: './horoscope.component.scss'
})
export class HoroscopeComponent {
  private _user: UserDTO | null = null;

  @Input()
  set user(value: UserDTO | null) {
    this._user = value;
    if (this._user) {
      this.fetchHoroscope();
    }
  }
  get user(): UserDTO | null {
    return this._user;
  }

  horoscopeData?: HoroscopeDTO;
  randomMessage: string = '';

  constructor(private horoscopeService: HoroscopeService) {}

  fetchHoroscope(): void {
    if (!this.user) { return; }
    this.horoscopeService.getHoroscope(this.user.zodiacSign).subscribe(
      (data: HoroscopeDTO) => {
        this.horoscopeData = data;
        // Determine a daily message based on the current day
        const messageCount = data.messages.length;
        const day = new Date().getDate(); 
        const index = day % messageCount;
        this.randomMessage = data.messages[index];
      },
      err => console.error('Error fetching horoscope:', err)
    );
  }

  getUserAvatar = getUserAvatar;
}
