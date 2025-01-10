import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { Page, SpinOut } from '@spin-cycle-mono/shared';

import { HistoryService } from './history.service';

@Component({
  selector: 'sc-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit {
  private readonly historyService: HistoryService = inject(HistoryService);

  public readonly currentPage: WritableSignal<number> = signal(0);
  public readonly hasMorePages: WritableSignal<boolean> = signal(false);
  public readonly spins: WritableSignal<SpinOut[]> = signal([]);

  ngOnInit(): void {
    this.getSpins();
  }

  getNextPage(): void {
    this.getSpins();
  }

  private getSpins(): void {
    this.historyService.getSpinsPage(this.currentPage() + 1).subscribe((spins: Page<SpinOut>) => {
      this.spins.update((existing) => [...existing, ...spins.content]);
      this.currentPage.set(spins.page);
      this.hasMorePages.set(!spins.lastPage);
    });
  }
}
