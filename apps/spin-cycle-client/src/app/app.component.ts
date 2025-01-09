import { Component, OnInit, Signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'sc-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly authService: AuthService = inject(AuthService);

  public readonly authUrl: string = this.authService.authUrl;
  public readonly authenticated: Signal<boolean> = this.authService.authenticated;

  ngOnInit(): void {
    this.authService.restoreToken();
  }
}
