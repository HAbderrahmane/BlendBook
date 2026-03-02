import { Routes } from '@angular/router';
import { Cart } from './components/Design/cart/cart';
import { Cocktails } from './components/Pages/cocktails/cocktails';
import { Home } from './components/Pages/home/home';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: Home },
  { path: 'cocktails', component: Cocktails },
  { path: 'panier', component: Cart },
  { path: '**', redirectTo: 'home' },
];
