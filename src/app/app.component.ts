import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'astropartner-app';

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Scroll to top after each navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  hideLayoutRoutes = ['/', '/login', '/register', '/profile/edit', '/profile/edit-password', '/forum/post-form'];

  showLayout(): boolean {
    // Hide layout for exact matches and the specific post-form/edit route
    return !(this.hideLayoutRoutes.includes(this.router.url) || this.router.url.startsWith('/forum/post-form/edit'));
  }
}
