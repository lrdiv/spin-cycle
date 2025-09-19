import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FolderOut, UserOut } from '@spin-cycle-mono/shared';
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
      .pipe(map((partial: UserOut) => this.castUser(partial)));
  }

  updateSettings(params: UserOut): Observable<UserOut> {
    return this.http
      .patch<UserOut>(`${environment.apiUrl}/settings/${params.id}`, params)
      .pipe(map((partial: UserOut) => this.castUser(partial)));
  }

  getFolders(): Observable<FolderOut[]> {
    return this.http.get<FolderOut[]>(`${environment.apiUrl}/discogs/folders`).pipe(
      map((folders: FolderOut[]) => {
        return folders.map((f) => new FolderOut(f.id, f.name, f.count));
      }),
    );
  }

  togglePause(params: UserOut): Observable<UserOut> {
    return this.http
      .post<UserOut>(`${environment.apiUrl}/settings/${params.id}/pause`, {})
      .pipe(map((partial: UserOut) => this.castUser(partial)));
  }

  private castUser(partial: UserOut): UserOut {
    const folder = new FolderOut(partial.folderId, partial.folderName);
    return new UserOut(
      partial.id,
      partial.discogsId,
      partial.username,
      partial.email,
      folder,
      partial.pausedAt ? new Date(partial.pausedAt) : null,
    );
  }
}
