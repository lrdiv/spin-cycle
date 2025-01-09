import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserOut } from '@spin-cycle-mono/shared';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly http: HttpClient = inject(HttpClient);

  getUserSettings(): Observable<UserOut> {
    return this.http
      .get<UserOut>(`${environment.apiUrl}/settings`)
      .pipe(map((partial: UserOut) => new UserOut(partial.id, partial.discogsId, partial.username, partial.email)));
  }

  updateSettings(id: string, params: { email: string | null }): Observable<UserOut> {
    return this.http
      .patch<UserOut>(`${environment.apiUrl}/settings/${id}`, params)
      .pipe(map((partial: UserOut) => new UserOut(partial.id, partial.discogsId, partial.username, partial.email)));
  }
}
