import { Component } from '@angular/core';
import { CocktailsDetails } from './components/cocktails/cocktails-details/cocktails-details';
import { Cocktails } from './components/cocktails/cocktails/cocktails';
import { CocktailsList } from './components/cocktails/cocktails-list/cocktails-list';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [Footer, Cocktails, Header],
  template: ` <app-header></app-header>
    <app-cocktails class="flex-auto"></app-cocktails>
    <app-footer></app-footer>`,
  styles: `
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `,
})
export class App {}
