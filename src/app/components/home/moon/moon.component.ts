import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MoonService } from '../../../services/moon.service';
import { CommonModule } from '@angular/common';
import { phaseToEmoji } from '../../../utils/moon-utils';

@Component({
  selector: 'app-moon',
  imports: [CommonModule],
  templateUrl: './moon.component.html',
  styleUrl: './moon.component.scss'
})
export class MoonComponent implements OnInit, AfterViewInit, OnDestroy {
  // Access the moon container DOM element
  @ViewChild('moonContainer') moonContainer!: ElementRef;

  currentMoonPhase: string = '';
  emoji!: string;
  moonImages: string[] = [
    'assets/images/moon-phases/new-moon.png',      
    'assets/images/moon-phases/growing-25.png',    
    'assets/images/moon-phases/growing-50.png',    
    'assets/images/moon-phases/growing-75.png',    
    'assets/images/moon-phases/full-moon.png',     
    'assets/images/moon-phases/decreasing-75.png', 
    'assets/images/moon-phases/decreasing-50.png', 
    'assets/images/moon-phases/decreasing-25.png' 
  ];
  currentImageIndex: number = 0;
  animationInterval: any;

  // Track if moon element is in view
  moonObserver!: IntersectionObserver;

  constructor(private moonService: MoonService) {}

  ngOnInit(): void {
    this.fetchCurrentMoonPhase();
  }

  // Start/stop animation when at least 10% of element is visible
  ngAfterViewInit(): void {
    this.moonObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.startMoonAnimation();
      } else {
        this.stopMoonAnimation();
      }
    }, { threshold: 0.1 });

    if (this.moonContainer) {
      this.moonObserver.observe(this.moonContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.stopMoonAnimation();
    this.moonObserver.unobserve(this.moonContainer.nativeElement);
  }

  // Load today's moon phase from cache or backend
  fetchCurrentMoonPhase(): void {
    const cachedMoonPhase = localStorage.getItem('cachedMoons');
    const cachedDate = localStorage.getItem('cachedDate');
    const today = new Date().toDateString();

    if (cachedMoonPhase && cachedDate === today) {
      const phaseNumbers: number[] = JSON.parse(cachedMoonPhase);
      this.updateMoonPhase(phaseNumbers[0]);
    } else {
      this.moonService.getTodayPhase().subscribe(
        (response) => {
          const todayMoonPhase = response.days[0].moonphase;
          this.updateMoonPhase(todayMoonPhase);
        },
        (err) => {
          this.currentMoonPhase = 'Unknown Phase'; 
        }
      );
    }
  }

  private updateMoonPhase(phaseNumber: number): void {
    this.currentMoonPhase = this.moonService.getMoonPhaseLabel(phaseNumber);
    this.emoji = phaseToEmoji(this.currentMoonPhase);
  }

  startMoonAnimation(): void {
    if (!this.animationInterval) {
      this.animationInterval = setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.moonImages.length;
      }, 1000);
    }
  }

  stopMoonAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
  }

  get currentMoonImage(): string {
    return this.moonImages[this.currentImageIndex];
  }
}
