import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { Icon } from '../../Design/icon/icon';
import { RoundButton } from '../../Design/buttons/round-button/round-button';
import { Loading } from '../../Design/loading/loading';
import { SearchBar } from '../../Design/search-bar/search-bar';
import { Pagination } from '../../Design/pagination/pagination';
import { CocktailsService, SortDir } from '../../../Services/cocktails.service';
import { Cocktail } from '../../../shared/Models/cocktail.model';
import { SortBy, Sorting } from '../../Design/sorting/sorting';

@Component({
  selector: 'app-cocktails-list',
  standalone: true,
  imports: [Icon, RoundButton, Pagination, Loading, Sorting, SearchBar],
  templateUrl: './cocktails-list.html',
  styleUrl: './cocktails-list.scss',
})
export class CocktailsList {
  private readonly cocktailsService = inject(CocktailsService);

  cocktailSelected = output<Cocktail | null>();
  loadingChange = output<boolean>();
  preselectedId = input<Cocktail['id'] | null>(null);

  readonly selectedId = signal<Cocktail['id'] | null>(null);
  readonly currentPage = signal(1);
  readonly searchTerm = signal('');
  readonly alcoholicOnly = signal(true);
  readonly sortBy = signal<SortBy>('alcoholic');
  readonly sortDir = signal<SortDir>('asc');
  readonly alcoholicSortDir = signal<SortDir>('asc');
  readonly createdAtSortDir = signal<SortDir>('asc');
  readonly pageSize = 10;
  readonly cocktailsResource = httpResource(
    () =>
      this.cocktailsService.buildCocktailsResourceRequest({
        page: this.currentPage(),
        perPage: this.pageSize,
        search: this.searchTerm() || undefined,
        alcoholic: this.preselectedId() == null ? this.alcoholicOnly() : undefined,
        sortBy: this.sortBy(),
        sortDir: this.sortDir(),
      }),
    {
      parse: (raw) => this.cocktailsService.mapCocktailsPage(raw),
      defaultValue: { data: [] },
    },
  );

  readonly cocktails = computed(() => this.cocktailsResource.value().data ?? []);
  readonly loading = computed(() => this.cocktailsResource.isLoading());
  readonly error = computed(() =>
    this.cocktailsResource.error() ? 'Impossible de charger les cocktails.' : null,
  );
  readonly totalPages = computed(
    () =>
      this.cocktailsResource.value().pagination?.pages ??
      this.cocktailsResource.value().meta?.totalPages ??
      1,
  );
  readonly totalCount = computed(
    () =>
      this.cocktailsResource.value().pagination?.count ??
      this.cocktailsResource.value().meta?.totalItems ??
      this.cocktails().length,
  );

  constructor() {
    effect(() => {
      this.loadingChange.emit(this.loading());
    });
    effect(() => {
      const preselected = this.preselectedId();
      if (preselected == null) return;
      if (this.sortBy() !== 'created_at') this.sortBy.set('created_at');
      if (this.sortDir() !== 'asc') this.sortDir.set('asc');
      if (this.createdAtSortDir() !== 'asc') this.createdAtSortDir.set('asc');
      if (this.currentPage() !== 1) this.currentPage.set(1);
    });
    effect(() => {
      const preselected = this.preselectedId();
      const items = this.cocktails();
      const currentSelectedId = this.selectedId();

      if (items.length === 0) {
        this.selectedId.set(null);
        return;
      }

      if (preselected != null) {
        const match = items.find((cocktail) => String(cocktail.id) === String(preselected));
        // Keep preselection stable: do not fallback to first item while a specific id is requested.
        if (match && currentSelectedId !== match.id) {
          this.select(match);
        }
        return;
      }

      if (currentSelectedId == null) {
        const selected = items[0];
        this.select(selected);
      }
    });
  }

  private resetSelection(): void {
    this.selectedId.set(null);
    this.cocktailSelected.emit(null);
  }

  onPageChange(page: number): void {
    this.resetSelection();
    this.currentPage.set(page);
  }

  toggleAlcoholic(): void {
    this.resetSelection();
    this.alcoholicOnly.update((value) => !value);
    this.currentPage.set(1);
  }

  applySearch(term: string): void {
    this.resetSelection();
    this.searchTerm.set(term.trim());
    this.currentPage.set(1);
  }

  toggleAlcoholicSort(): void {
    this.resetSelection();
    const nextDir = this.sortBy() === 'alcoholic' && this.sortDir() === 'asc' ? 'desc' : 'asc';
    this.alcoholicSortDir.set(nextDir);
    this.sortBy.set('alcoholic');
    this.sortDir.set(nextDir);
    this.alcoholicOnly.set(nextDir === 'desc');
    this.currentPage.set(1);
  }

  toggleCreatedAtSort(): void {
    this.resetSelection();
    const nextDir = this.sortBy() === 'created_at' && this.sortDir() === 'asc' ? 'desc' : 'asc';
    this.createdAtSortDir.set(nextDir);
    this.sortBy.set('created_at');
    this.sortDir.set(nextDir);
    this.currentPage.set(1);
  }

  select(c: Cocktail): void {
    this.selectedId.set(c.id);
    this.cocktailSelected.emit(c);
  }

  getImageUrl(cocktail: Cocktail): string | undefined {
    return cocktail.imageUrl || cocktail.image;
  }

  formatCreatedAt(value: Date): string {
    if (Number.isNaN(value.getTime())) {
      return '';
    }
    return value.toLocaleDateString();
  }
}
