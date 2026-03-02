import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () => import('./components/Pages/home/home').then((m) => m.Home),
  },
  {
    path: 'cocktails',
    loadComponent: () =>
      import('./components/Pages/cocktails/cocktails').then((m) => m.Cocktails),
  },
  {
    path: 'ingredients',
    loadComponent: () =>
      import('./components/Pages/ingredients/ingredients').then((m) => m.Ingredients),
  },
  {
    path: 'panier',
    loadComponent: () => import('./components/Design/cart/cart').then((m) => m.Cart),
  },
  { path: '**', redirectTo: 'home' },
];
