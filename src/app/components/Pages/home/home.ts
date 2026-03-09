import { DOCUMENT } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoundButton } from '../../Design/buttons/round-button/round-button';
import { Icon } from '../../Design/icon/icon';
import { Loading } from '../../Design/loading/loading';
import { CocktailsService } from '../../../Services/cocktails.service';
import { Cocktail } from '../../../shared/Models/cocktail.model';
import { IngredientsService } from '../../../Services/ingredients.service';
import { Ingredient } from '../../../shared/Models/ingredient.model';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { I18nService } from '../../../Services/i18n.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RoundButton, Icon, Loading, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly document = inject(DOCUMENT);
  private readonly cocktailsService = inject(CocktailsService);
  private readonly ingredientsService = inject(IngredientsService);
  private readonly router = inject(Router);
  private readonly i18nService = inject(I18nService);
  readonly alcoholicCocktailsResource = this.cocktailsService.createCocktailsResource(() => ({
    page: 1,
    perPage: 2,
    sortBy: 'created_at',
    sortDir: 'desc',
    alcoholic: true,
  }));
  readonly nonAlcoholicCocktailsResource = this.cocktailsService.createCocktailsResource(() => ({
    page: 1,
    perPage: 2,
    sortBy: 'created_at',
    sortDir: 'desc',
    alcoholic: false,
  }));

  readonly cocktails = computed(() => [
    ...(this.alcoholicCocktailsResource.value().data ?? []),
    ...(this.nonAlcoholicCocktailsResource.value().data ?? []),
  ]);
  readonly ingredientsAutoA = this.ingredientsService.createIngredientsAutocompleteResource(
    () => 'a',
    { data: [] },
  );
  readonly ingredientsAutoE = this.ingredientsService.createIngredientsAutocompleteResource(
    () => 'e',
    { data: [] },
  );
  readonly ingredientsAutoO = this.ingredientsService.createIngredientsAutocompleteResource(
    () => 'o',
    { data: [] },
  );
  readonly ingredients = computed(() => {
    const groups = [
      this.ingredientsAutoA.hasValue() ? (this.ingredientsAutoA.value().data ?? []) : [],
      this.ingredientsAutoE.hasValue() ? (this.ingredientsAutoE.value().data ?? []) : [],
      this.ingredientsAutoO.hasValue() ? (this.ingredientsAutoO.value().data ?? []) : [],
    ];
    const merged = groups.flat();
    const unique = new Map<string, Ingredient>();
    for (const ingredient of merged) {
      unique.set(String(ingredient.id), ingredient);
    }
    return Array.from(unique.values());
  });
  readonly ingredientsLoading = computed(
    () =>
      this.ingredientsAutoA.isLoading() ||
      this.ingredientsAutoE.isLoading() ||
      this.ingredientsAutoO.isLoading(),
  );
  readonly featuredIngredients = computed(() => this.pickRandom(this.ingredients(), 4));
  readonly loading = computed(
    () =>
      this.alcoholicCocktailsResource.isLoading() || this.nonAlcoholicCocktailsResource.isLoading(),
  );
  readonly error = computed(() =>
    this.alcoholicCocktailsResource.error() || this.nonAlcoholicCocktailsResource.error()
      ? this.i18nService.t('home.error.loadCocktails')
      : null,
  );

  readonly secondaryImage = computed(
    () => this.getImageUrl(this.cocktails()[2]) || this.getImageUrl(this.cocktails()[3]),
  );
  readonly featuredCocktails = computed(() => {
    return this.cocktails();
  });
  readonly coverImageUrl = this.assetUrl('cover.svg');

  goToCocktails(): void {
    this.router.navigateByUrl('/cocktails');
  }

  goToCocktailDetails(cocktail: Cocktail): void {
    this.router.navigate(['/cocktails'], {
      queryParams: { selected: cocktail.id },
    });
  }

  goToIngredientDetails(ingredient: Ingredient): void {
    this.router.navigate(['/ingredients'], {
      queryParams: { selected: ingredient.id },
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

  private pickRandom<T>(source: T[], count: number): T[] {
    if (source.length <= count) return source;
    const clone = [...source];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone.slice(0, count);
  }

  getIngredientImage(ingredient?: Ingredient): string | undefined {
    return ingredient?.imageUrl;
  }

  private assetUrl(path: string): string {
    return new URL(path, this.document.baseURI).toString();
  }
}
