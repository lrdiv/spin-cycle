import { Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { UnauthGuard } from './auth/unauth.guard';
import { HistoryComponent } from './history/history.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthGuard],
  },
];
