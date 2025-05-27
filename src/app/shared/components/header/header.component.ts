import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router'; 
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    MenuComponent, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isMenuOpen = false;
  isDesktop: boolean = window.innerWidth >= 768;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isDesktop = window.innerWidth >= 768;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.classList.toggle('menu-open', this.isMenuOpen);
  }
  
  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.classList.remove('menu-open');
  }
  
  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    window.location.reload();
  }
}
