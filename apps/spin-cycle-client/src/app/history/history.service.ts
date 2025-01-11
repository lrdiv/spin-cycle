import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Page, SpinOut } from '@spin-cycle-mono/shared';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly http: HttpClient = inject(HttpClient);

  getSpinsPage(page: number): Observable<Page<SpinOut>> {
    return this.http.get<Page<SpinOut>>(`${environment.apiUrl}/spins`, { params: { page } }).pipe(
      map((page: Page<SpinOut>) => {
        return {
          ...page,
          content: page.content.map((spin: SpinOut) => {
            return new SpinOut(spin.id, spin.discogsId, spin.artistName, spin.recordName, spin.createdAt, spin.played);
          }),
        };
      }),
    );
  }
}
