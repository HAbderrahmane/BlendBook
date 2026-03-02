import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  readonly currentPage = input(1);
  readonly totalPages = input(1);
  readonly pageChange = output<number>();

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    return Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
  });

  goToPage(page: number): void {
    const boundedPage = Math.max(1, Math.min(page, this.totalPages()));
    if (boundedPage !== this.currentPage()) {
      this.pageChange.emit(boundedPage);
    }
  }

  commitPageInput(rawValue: string): void {
    const value = Number(rawValue);
    if (!Number.isFinite(value)) {
      return;
    }
    this.goToPage(Math.trunc(value));
  }
}
