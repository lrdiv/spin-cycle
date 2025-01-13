import { Component, OnInit, Signal, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'sc-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  public readonly authUrl: string = this.authService.authUrl;
  public readonly authenticated: Signal<boolean> = this.authService.authenticated;

  ngOnInit(): void {
    this.authService.restoreToken();
    if (this.authenticated()) {
      this.router.navigate(['/history']);
    }
  }

  logout(e: MouseEvent): Promise<boolean> {
    e.preventDefault();
    this.authService.revokeToken();
    return this.router.navigate(['/login']);
  }
}
