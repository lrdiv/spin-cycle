import { DatePipe } from '@angular/common';
import { Component, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Page, SpinOut } from '@spin-cycle-mono/shared';

import { HistoryService } from './history.service';

@Component({
  selector: 'sc-history',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  private readonly historyService: HistoryService = inject(HistoryService);

  public readonly currentPage: WritableSignal<number> = signal(0);
  public readonly hasMorePages: WritableSignal<boolean> = signal(false);
  public readonly spins: WritableSignal<SpinOut[] | null> = signal(null);

  public readonly spinsLoaded: Signal<boolean> = computed(() => this.spins() !== null);
  public readonly loadedSpins: Signal<SpinOut[]> = computed(() => this.spins() ?? []);

  ngOnInit(): void {
    this.getSpins();
  }

  getNextPage(): void {
    this.getSpins();
  }

  updatePlayed(spin: SpinOut): void {
    spin.played = !spin.played;
    this.historyService.updateSpin(spin).subscribe((updated: SpinOut) => {
      this.spins.update((spins: SpinOut[] | null) => {
        if (!spins) {
          return [];
        }

        return spins.map((existing: SpinOut) => {
          return existing.id === updated.id ? updated : existing;
        });
      });
    });
  }

  private getSpins(): void {
    this.historyService.getSpinsPage(this.currentPage() + 1).subscribe((spins: Page<SpinOut>) => {
      this.spins.update((existing: SpinOut[] | null) => [...(existing ?? []), ...spins.content]);
      this.currentPage.set(spins.page);
      this.hasMorePages.set(!spins.lastPage);
    });
  }
}
