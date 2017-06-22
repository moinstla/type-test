import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { TypingTestComponent } from './typing-test/typing-test.component';
import { PlayerComponent } from './player/player.component';

const appRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'type-test',
    component: TypingTestComponent
  },
  {
    path: 'players/:id',
    component: PlayerComponent
  },
  {
    path: 'players/:id/type-test',
    component: TypingTestComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
