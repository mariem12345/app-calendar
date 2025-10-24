import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Calendar } from './features/calendar/calendar/calendar';
import { SessionForm } from './features/admin/session-form/session-form';
import { SessionList } from './features/admin/session-list/session-list';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  { path: 'login', component: Login },
  { 
    path: 'calendar', 
    component: Calendar,
    canActivate: [authGuard]
  },
  { 
    path: 'admin', 
    component: SessionList,
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'admin/session/new', 
    component: SessionForm,
    canActivate: [ authGuard, adminGuard]
  },
  { 
    path: 'admin/session/edit/:id', 
    component: SessionForm,
    canActivate: [authGuard, adminGuard]
  },
  { path: '**', redirectTo: '/calendar' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }