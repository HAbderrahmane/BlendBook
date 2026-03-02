import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-round-button',
  standalone: true,
  host: {
    '[class.is-active]': 'active()',
    '[class.is-icon-only]': 'iconOnly()',
  },
  templateUrl: './round-button.html',
  styleUrl: './round-button.scss',
})
export class RoundButton {
  readonly active = input(false);
  readonly iconOnly = input(false);
  readonly clicked = output<void>();
}
