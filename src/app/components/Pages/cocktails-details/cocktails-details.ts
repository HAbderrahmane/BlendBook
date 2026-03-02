import { Component, input } from '@angular/core';
import { Loading } from '../../Design/loading/loading';
import { Cocktail } from '../../../shared/Models/cocktail.model';

@Component({
  selector: 'app-cocktails-details',
  imports: [Loading],
  templateUrl: './cocktails-details.html',
  styleUrl: './cocktails-details.scss',
})
export class CocktailsDetails {
  readonly cocktail = input<Cocktail | null>(null);
  readonly loading = input(false);

  getImageUrl(cocktail: Cocktail): string | undefined {
    return cocktail.imageUrl || cocktail.image;
  }
}
