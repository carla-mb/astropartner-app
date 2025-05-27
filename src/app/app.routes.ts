import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent) 
  },
  { path: 'home', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile/edit', loadComponent: () => import('./components/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'profile/edit-password', loadComponent: () => import('./components/profile/edit-password/edit-password.component').then(m => m.EditPasswordComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'calendar', 
    loadComponent: () => import('./components/calendar/calendar.component').then(m => m.CalendarComponent) 
  },
  { 
    path: 'forum', 
    loadComponent: () => import('./components/forum/posts-list/posts-list.component').then(m => m.PostsListComponent) 
  },
  { 
    path: 'forum/post-detail/:id', 
    loadComponent: () => import('./components/forum/post-detail/post-detail.component').then(m => m.PostDetailComponent) 
  },
  { 
    path: 'forum/post-form', 
    loadComponent: () => import('./components/forum/post-form/post-form.component').then(m => m.PostFormComponent), 
    canActivate: [AuthGuard] 
  },
  { path: 'forum/post-form/edit/:id', 
    loadComponent: () => import('./components/forum/post-form/post-form.component').then(m => m.PostFormComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'about', 
    loadComponent: () => import('./components/about/about.component').then(m => m.AboutComponent) 
  },
  { 
    path: '**', 
    redirectTo: 'home' 
  }
];
