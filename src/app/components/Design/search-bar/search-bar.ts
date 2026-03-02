import { Component, effect, input, output, signal } from '@angular/core';
import { RoundButton } from '../buttons/round-button/round-button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [RoundButton],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  readonly value = input('');
  readonly placeholder = input('Rechercher...');
  readonly submitted = output<string>();

  readonly query = signal('');

  constructor() {
    effect(() => {
      this.query.set(this.value());
    });
  }

  submit(): void {
    this.submitted.emit(this.query().trim());
  }
}
