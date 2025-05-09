import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { PostsListComponent } from './components/forum/posts-list/posts-list.component';
import { PostDetailComponent } from './components/forum/post-detail/post-detail.component';
import { PostFormComponent } from './components/forum/post-form/post-form.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent },
  { path: 'forum', component: PostsListComponent },
  { path: 'forum/post-detail/:id', component: PostDetailComponent },
  { path: 'forum/post-form', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'forum/post-form/edit/:id', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];
