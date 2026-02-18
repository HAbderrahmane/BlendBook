import { Component } from '@angular/core';
import { CocktailsInterface } from '../../../shared/interfaces/cocktails.interface';

@Component({
  selector: 'app-cocktails-details',
  imports: [],
  template: `<div class="flex flex-column gap-24">
    <img [src]="cocktail.imageUrl" alt="{{ cocktail.name }}" class="img object-cover rounded-lg" />
    <div class="description-block">
      <h2 class="text-2xl font-bold mb-20">{{ cocktail.name }}</h2>
      <p class="text-gray-600">{{ cocktail.description }}</p>
    </div>
  </div> `,
  styles: `
    :host {
      display: flex;
      padding: 24px;
    }
  `,
})
export class CocktailsDetails {
  cocktail: CocktailsInterface = {
    imageUrl: 'https://www.thecocktaildb.com/images/media/drink/3z6xdi1589574603.jpg',
    name: 'Mojito',
    description:
      "Le mojito est un cocktail traditionnel cubain à base de rhum, de menthe, de sucre, de citron vert et d'eau gazeuse. Il est rafraîchissant et parfait pour les journées chaudes d'été.",
  };
}
