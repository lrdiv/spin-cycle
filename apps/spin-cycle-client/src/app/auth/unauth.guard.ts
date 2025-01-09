import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const UnauthGuard: CanActivateFn = () => {
  return inject(AuthService).authenticated() ? inject(Router).createUrlTree(['/settings']) : true;
};
