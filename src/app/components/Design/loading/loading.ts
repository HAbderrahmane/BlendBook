import { Component } from '@angular/core';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [Icon],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {}
