import { Injectable, Signal, WritableSignal, inject, signal } from '@angular/core';

import { environment } from '../../environments/environment';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageService: StorageService = inject(StorageService);

  private readonly _authenticated: WritableSignal<boolean> = signal(false);
  public authenticated: Signal<boolean> = this._authenticated.asReadonly();

  public readonly authUrl: string = `${environment.apiUrl}/auth`;

  public getToken(): string | null {
    return this.storageService.get(environment.localStorageTokenKey);
  }

  public setToken(token: string): void {
    this.storageService.set(environment.localStorageTokenKey, token);
    this._authenticated.set(true);
  }

  public revokeToken(): void {
    this.storageService.remove(environment.localStorageTokenKey);
    this._authenticated.set(false);
  }

  public restoreToken(): void {
    const token: string | null = this.storageService.get(environment.localStorageTokenKey);
    this._authenticated.set(!!token);
  }
}
