import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../icon/icon';
import { RoundButton } from '../buttons/round-button/round-button';
import { SquareButton } from '../buttons/square-button/square-button';

@Component({
  selector: 'app-header',
  imports: [Icon, RoundButton, SquareButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);

  go(path: string): void {
    this.router.navigateByUrl(path);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
