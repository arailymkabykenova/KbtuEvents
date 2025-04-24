import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { AllEventsComponent } from './components/all-events/all-events.component'; 
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { authGuard } from '../app/guards/auth.guards';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'KBTU Events - Home' },
    { path: 'event/:id', component: EventDetailComponent, title: 'Event Details' },
    { path: 'all-events', component: AllEventsComponent, title: 'All Events' }, 
    { path: 'login', component: LoginComponent, title: 'Login' },
    { path: 'registration', component: RegistrationComponent, title: 'Register' },
    {
      path: 'dashboard', 
      component: DashboardComponent,
      canActivate: [authGuard], 
      title: 'My Profile'
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ];