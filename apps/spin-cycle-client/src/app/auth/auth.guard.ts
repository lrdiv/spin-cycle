import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = () => {
  return inject(AuthService).authenticated() ? true : inject(Router).createUrlTree(['/auth']);
};
