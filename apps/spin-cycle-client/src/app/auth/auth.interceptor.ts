import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';

import { AuthService } from './auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService: AuthService = inject(AuthService);
  const processed: HttpRequest<any> =
    authService.authenticated() && authService.getToken()
      ? req.clone({ headers: new HttpHeaders({ Authorization: `Bearer ${authService.getToken()}` }) })
      : req;

  return next(processed).pipe(
    catchError((err: HttpResponse<any>) => {
      if (err.status === 401) {
        authService.revokeToken();
        inject(Router).navigate(['/login']);
      }
      return of(err);
    }),
  );
}
