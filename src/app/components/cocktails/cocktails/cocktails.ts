import { Component } from '@angular/core';
import { CocktailsList } from '../cocktails-list/cocktails-list';
import { CocktailsDetails } from '../cocktails-details/cocktails-details';

@Component({
  selector: 'app-cocktails',
  imports: [CocktailsList, CocktailsDetails],
  template: `
    <app-cocktails-list class="flex-auto card w-50" />
    <app-cocktails-details class="flex-auto card w-50" />
  `,
  styles: `
    :host {
      display: flex;
      gap: 24px;
      padding: 24px;
    }
  `,
})
export class Cocktails {}
