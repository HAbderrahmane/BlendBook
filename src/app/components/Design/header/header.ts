import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { I18nService } from '../../../Services/i18n.service';
import { Icon } from '../icon/icon';
import { RoundButton } from '../buttons/round-button/round-button';
import { Cart } from '../cart/cart';
import { LikedCocktailsService } from '../../../Services/liked-cocktails.service';
import { Cocktail } from '../../../shared/Models/cocktail.model';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { AppLanguage } from '../../../i18n/types';

@Component({
  selector: 'app-header',
  imports: [Icon, RoundButton, Cart, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly likedCocktailsService = inject(LikedCocktailsService);
  private readonly i18nService = inject(I18nService);

  readonly theme = input<'base' | 'moon' | 'night-meteor'>('base');
  readonly themeChange = output<'base' | 'moon' | 'night-meteor'>();
  readonly showCartDialog = signal(false);
  readonly likedCocktails = computed(() => this.likedCocktailsService.likedCocktails());
  readonly likedCount = computed(() => this.likedCocktailsService.likedCount());
  readonly currentLanguage = computed(() => this.i18nService.language());
  readonly isLoggedIn = this.authService.isLoggedIn;

  go(path: string): void {
    this.router.navigateByUrl(path);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleCartDialog(): void {
    this.showCartDialog.update((value) => !value);
  }

  closeCartDialog(): void {
    this.showCartDialog.set(false);
  }

  onCartCocktailSelected(cocktail: Cocktail): void {
    this.router.navigate(['/cocktails'], { queryParams: { selected: cocktail.id } });
    this.closeCartDialog();
  }

  onUnlikeCocktail(id: Cocktail['id']): void {
    this.likedCocktailsService.remove(id);
  }

  setLanguage(language: AppLanguage): void {
    this.i18nService.setLanguage(language);
  }

  toggleLanguage(): void {
    this.setLanguage(this.currentLanguage() === 'fr' ? 'en' : 'fr');
  }

  async onAuthAction(): Promise<void> {
    if (this.isLoggedIn()) {
      await this.authService.logout();
      this.router.navigateByUrl('/home');
      return;
    }

    this.router.navigateByUrl('/login');
  }

  toggleTheme(): void {
    this.themeChange.emit(this.nextTheme());
  }

  nextTheme(): 'base' | 'moon' | 'night-meteor' {
    const current = this.theme();
    if (current === 'base') return 'moon';
    if (current === 'moon') return 'night-meteor';
    return 'base';
  }

  nextThemeIcon(): string {
    const current = this.theme();
    if (current === 'moon') return 'theme-moon';
    if (current === 'night-meteor') return 'theme-stars';
    return 'theme-sun';
  }

  nextThemeLabelKey(): string {
    const next = this.nextTheme();
    if (next === 'moon') return 'header.theme.toMoon';
    if (next === 'night-meteor') return 'header.theme.toNightMeteor';
    return 'header.theme.toBase';
  }
}
