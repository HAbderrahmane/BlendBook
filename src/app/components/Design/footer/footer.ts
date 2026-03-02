import { Component } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [Icon],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
