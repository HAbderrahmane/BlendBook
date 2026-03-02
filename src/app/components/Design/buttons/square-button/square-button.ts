import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-square-button',
  standalone: true,
  host: {
    '[class.is-active]': 'active()',
    '[class.is-icon-only]': 'iconOnly()',
  },
  templateUrl: './square-button.html',
  styleUrl: './square-button.scss',
})
export class SquareButton {
  readonly active = input(false);
  readonly iconOnly = input(false);
  readonly clicked = output<void>();
}
