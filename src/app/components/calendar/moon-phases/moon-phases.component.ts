import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MoonService } from '../../../services/moon.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { phaseToEmoji } from '../../../utils/moon-utils';

@Component({
  selector: 'app-moon-phases',
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './moon-phases.component.html',
  styleUrl: './moon-phases.component.scss'
})
export class MoonPhasesComponent implements OnInit {
  tableData: any[][] = [];

  constructor(private moonService: MoonService) {}

  ngOnInit(): void {
    this.loadMoonForecast();
  }

  loadMoonForecast(): void {
    const cachedForecast = localStorage.getItem('cachedMoons');
    const cachedDate = localStorage.getItem('cachedDate');
    const today = new Date().toDateString();

    if (cachedForecast && cachedDate === today) {
      // Use the cached raw moon phases
      const phases: number[] = JSON.parse(cachedForecast);
      this.tableData = this.buildForecastTable(phases);
    } else {
      // Fetch the raw data from the API and cache it
      this.moonService.getMoonPhases().subscribe((phases: number[]) => {
        const rawPhases = phases.slice(0, 14); 
        localStorage.setItem('cachedMoons', JSON.stringify(rawPhases));
        localStorage.setItem('cachedDate', today);
        this.tableData = this.buildForecastTable(rawPhases);
      });
    }
  }

  buildForecastTable(phases: number[]): any[][] {
    const today = new Date();
    const forecast: { label: string; phase: string }[] = phases.map((phase: number, index: number) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return {
        label: index === 0 ? 'Today' : date.toDateString(),
        phase: this.moonService.getMoonPhaseLabel(phase)
      };
    });
    // Break forecast into two weeks
    return [forecast.slice(0, 7), forecast.slice(7, 14)];
  }

  phaseToEmoji = phaseToEmoji;
}
