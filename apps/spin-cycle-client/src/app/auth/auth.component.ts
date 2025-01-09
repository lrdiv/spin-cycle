import { Component, DestroyRef, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'sc-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  private readonly authService: AuthService = inject(AuthService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  public readonly error: WritableSignal<string | null> = signal(null);

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: ParamMap) => {
      const token = params.get('token');
      if (!token) {
        this.error.set('Unable to authenticate');
        return;
      }

      this.authService.setToken(token);
      this.router.navigate(['/history']);
    });
  }
}
