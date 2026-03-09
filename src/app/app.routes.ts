import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/Pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/Pages/register/register').then((m) => m.Register),
  },
  {
    path: 'home',
    loadComponent: () => import('./components/Pages/home/home').then((m) => m.Home),
  },
  {
    path: 'cocktails',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/Pages/cocktails/cocktails').then((m) => m.Cocktails),
  },
  {
    path: 'ingredients',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/Pages/ingredients/ingredients').then((m) => m.Ingredients),
  },
  {
    path: 'panier',
    canActivate: [authGuard],
    loadComponent: () => import('./components/Design/cart/cart').then((m) => m.Cart),
  },
  { path: '**', redirectTo: 'home' },
];
