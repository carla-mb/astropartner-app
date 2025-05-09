import { Component, OnInit } from '@angular/core';
import { MoonService } from '../../../services/moon.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moon',
  imports: [CommonModule],
  templateUrl: './moon.component.html',
  styleUrl: './moon.component.scss'
})
export class MoonComponent implements OnInit {
  currentMoonPhase: string = '';

  constructor(private moonService: MoonService) {}

  ngOnInit(): void {
    this.fetchCurrentMoonPhase();
  }

  // Extract today's moon phase
  fetchCurrentMoonPhase(): void {
    const cachedMoonPhase = localStorage.getItem('moonPhase');
    const cachedDate = localStorage.getItem('cachedDate');
    const today = new Date().toDateString();

    // If available, use cached data otherwise fetch from backend
    if (cachedMoonPhase && cachedDate === today) {
      this.currentMoonPhase = cachedMoonPhase;
    } else {
      this.moonService.getMoonPhases().subscribe(
        (response) => {
          const todayMoonPhase = response.days[0].moonphase;
          this.currentMoonPhase = this.getMoonPhaseLabel(todayMoonPhase);
          localStorage.setItem('moonPhase', this.currentMoonPhase);
          localStorage.setItem('cachedDate', today); 
        },
        (err) => {
          console.error('Error fetching moon phase:', err);
          this.currentMoonPhase = 'Unknown Phase'; 
        }
      );
    }
  }

  getMoonPhaseLabel(phase: number): string {
    if (phase === 0) return 'New Moon';
    else if (phase > 0 && phase < 0.25) return 'Waxing Crescent';
    else if (phase === 0.25) return 'First Quarter';
    else if (phase > 0.25 && phase < 0.5) return 'Waxing Gibbous';
    else if (phase === 0.5) return 'Full Moon';
    else if (phase > 0.5 && phase < 0.75) return 'Waning Gibbous';
    else if (phase === 0.75) return 'Last Quarter';
    else if (phase > 0.75 && phase < 1) return 'Waning Crescent';
    else return 'Unknown';
  }  
}
