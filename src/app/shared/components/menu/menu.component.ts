import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router'; 
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, 
    MatSidenavModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() isOpen = false;
  @Output() menuClosed = new EventEmitter<void>();

  isAuthenticated: boolean = false;
  isDesktop: boolean = window.innerWidth >= 768;

  menuItems = [
    { label: 'Home', path: '/home' },
    { label: 'Profile', path: '/profile' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Forum', path: '/forum' },
    { label: 'About AstroPartner', path: '/about' }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  // Dynamically check screen size when resizing
  @HostListener('window:resize', []) 
  onResize() {
    this.isDesktop = window.innerWidth >= 768;
  }

  navigateTo(item: any): void {
    this.menuClosed.emit(); 
    this.router.navigate([item.path]);
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.menuClosed.emit(); 
    window.location.reload();
  }
}
