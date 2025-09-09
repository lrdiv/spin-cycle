import { Component, inject } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'sc-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  private readonly authService: AuthService = inject(AuthService);

  public readonly authUrl: string = this.authService.authUrl;
}
