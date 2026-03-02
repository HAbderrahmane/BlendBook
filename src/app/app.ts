import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/Design/footer/footer';
import { Header } from './components/Design/header/header';
import { CocktailsService } from './Services/cocktails.service';
import { IngredientsService } from './Services/ingredients.service';
import { LikedCocktailsService } from './Services/liked-cocktails.service';

@Component({
  selector: 'app-root',
  imports: [Footer, Header, RouterOutlet],
  providers: [CocktailsService, IngredientsService, LikedCocktailsService],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
