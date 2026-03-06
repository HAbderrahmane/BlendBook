import { Component, input, output } from '@angular/core';
import { RoundButton } from '../buttons/round-button/round-button';
import { Icon } from '../icon/icon';
import { TranslatePipe } from '../../../pipes/translate.pipe';

export type SortBy = 'alcoholic' | 'created_at';
export type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-sorting',
  standalone: true,
  imports: [RoundButton, Icon, TranslatePipe],
  templateUrl: './sorting.html',
  styleUrl: './sorting.scss',
})
export class Sorting {
  readonly sortBy = input<SortBy>('alcoholic');
  readonly alcoholicDir = input<SortDir>('asc');
  readonly createdAtDir = input<SortDir>('asc');

  readonly alcoholicToggle = output<void>();
  readonly createdAtToggle = output<void>();
}
