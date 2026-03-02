import { httpResource } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoundButton } from '../../Design/buttons/round-button/round-button';
import { Icon } from '../../Design/icon/icon';
import { Loading } from '../../Design/loading/loading';
import { CocktailsService } from '../../../Services/cocktails.service';
import { Cocktail } from '../../../shared/Models/cocktail.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RoundButton, Icon, Loading],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly cocktailsService = inject(CocktailsService);
  private readonly router = inject(Router);
  readonly cocktailsResource = httpResource(
    () =>
      this.cocktailsService.buildCocktailsResourceRequest({
        page: 1,
        perPage: 8,
        sortBy: 'created_at',
        sortDir: 'asc',
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

  readonly secondaryImage = computed(
    () => this.getImageUrl(this.cocktails()[2]) || this.getImageUrl(this.cocktails()[3]),
  );
  readonly featuredCocktails = computed(() => this.cocktails().slice(0, 8));

  goToCocktails(): void {
    this.router.navigateByUrl('/cocktails');
  }

  goToCocktailDetails(cocktail: Cocktail): void {
    this.router.navigate(['/cocktails'], {
      queryParams: { selected: cocktail.id },
    });
  }

  getImageUrl(cocktail?: Cocktail): string | undefined {
    if (!cocktail) return undefined;
    return cocktail.image || cocktail.imageUrl;
  }

  getAlternativeImageUrl(cocktail?: Cocktail): string | undefined {
    if (!cocktail) return undefined;
    const primary = this.getImageUrl(cocktail);
    if (primary && primary === cocktail.image) return cocktail.imageUrl;
    if (primary && primary === cocktail.imageUrl) return cocktail.image;
    return undefined;
  }

  onCardImageError(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;

    const alternative = target.getAttribute('data-alt-src');
    if (alternative && target.src !== alternative) {
      target.src = alternative;
      target.removeAttribute('data-alt-src');
      return;
    }

    target.style.visibility = 'hidden';
  }
}
