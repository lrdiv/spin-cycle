import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserOut } from '@spin-cycle-mono/shared';

import { SettingsService } from './settings.service';

interface IUserForm {
  email: FormControl<string | null>;
}

@Component({
  selector: 'sc-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly settingsService: SettingsService = inject(SettingsService);

  public readonly settings: WritableSignal<UserOut | null> = signal(null);

  public readonly form: FormGroup<IUserForm> = new FormGroup<IUserForm>({
    email: new FormControl<string | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.settingsService.getUserSettings().subscribe((settings: UserOut) => {
      this.settings.set(settings);

      this.form.controls.email.setValue(settings.email);
      this.form.markAsPristine();
    });
  }

  save(): void {
    const settings: UserOut | null = this.settings();
    if (this.form.valid && settings) {
      this.settingsService
        .updateSettings(settings.id, { email: this.form.controls.email.value })
        .subscribe((settings: UserOut) => {
          this.settings.set(settings);
        });
    }
  }
}
