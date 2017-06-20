import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'admin',
    component: AuthComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
