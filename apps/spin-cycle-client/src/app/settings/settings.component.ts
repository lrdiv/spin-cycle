import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FolderOut, UserOut } from '@spin-cycle-mono/shared';
import { ToastrService } from 'ngx-toastr';

import { SettingsService } from './settings.service';

interface IUserForm {
  email: FormControl<string | null>;
  folder: FormControl<FolderOut | null>;
}

@Component({
  selector: 'sc-settings',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly settingsService: SettingsService = inject(SettingsService);
  private readonly toastService: ToastrService = inject(ToastrService);

  private readonly defaultFolder: FolderOut = new FolderOut(0, 'All');

  public readonly folders: WritableSignal<FolderOut[]> = signal([this.defaultFolder]);
  public readonly foldersLoaded: WritableSignal<boolean> = signal(false);
  public readonly saving: WritableSignal<boolean> = signal(false);
  public readonly togglingPause: WritableSignal<boolean> = signal(false);
  public readonly settings: WritableSignal<UserOut | null> = signal(null);

  public readonly form: FormGroup<IUserForm> = new FormGroup<IUserForm>({
    email: new FormControl<string | null>(null, [Validators.required]),
    folder: new FormControl<FolderOut | null>(this.defaultFolder, [Validators.required]),
  });

  ngOnInit(): void {
    this.settingsService.getUserSettings().subscribe((settings: UserOut) => {
      this.settings.set(settings);
      this.form.controls.email.setValue(settings.email);
      this.form.controls.folder.setValue(new FolderOut(settings.folderId, settings.folderName));
      this.form.markAsPristine();
    });
  }

  isPaused(): boolean {
    const s: UserOut | null = this.settings();
    return !!s?.pausedAt;
  }

  togglePause(): void {
    const s: UserOut | null = this.settings();
    if (!s || this.togglingPause()) {
      return;
    }

    this.togglingPause.set(true);
    this.settingsService.togglePause(s).subscribe({
      next: (updated: UserOut) => {
        this.settings.set(updated);
        this.togglingPause.set(false);
        const nowPaused: boolean = !!updated.pausedAt;
        this.toastService.success(nowPaused ? 'Spin Cycle paused' : 'Spin Cycle resumed!', undefined, {
          toastClass: `ngx-toastr ${nowPaused ? 'is-paused' : 'is-resumed'}`,
        });
      },
      error: () => {
        this.togglingPause.set(false);
        this.toastService.error('Unable to pause 😭');
      },
    });
  }

  save(): void {
    const selectedFolder: FolderOut | null = this.form.controls.folder.value;
    const settings: UserOut | null = this.settings();

    if (this.form.valid && settings) {
      settings.email = this.form.controls.email.value;
      if (selectedFolder && selectedFolder.id !== settings.folderId) {
        settings.folderId = selectedFolder.id;
        settings.folderName = selectedFolder.name;
      }

      this.saving.set(true);
      this.settingsService.updateSettings(settings).subscribe({
        next: (settings: UserOut) => {
          this.settings.set(settings);
          this.saving.set(false);
          this.toastService.success('Settings saved!');
          this.form.markAsPristine();
        },
        error: () => {
          this.toastService.error('Unable to save settings 😭');
          this.saving.set(false);
        },
      });
    }
  }

  loadFolders(): void {
    if (this.foldersLoaded()) {
      return;
    }

    this.settingsService.getFolders().subscribe((folders: FolderOut[]) => {
      this.folders.set(folders);
      this.foldersLoaded.set(true);
    });
  }

  compareFolders(a: FolderOut, b: FolderOut): boolean {
    return a.id === b.id;
  }
}
