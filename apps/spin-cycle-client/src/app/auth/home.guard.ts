import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const HomeGuard: CanActivateFn = () => {
  return inject(AuthService).authenticated() ? inject(Router).createUrlTree(['/history']) : true;
};
