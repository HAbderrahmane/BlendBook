import { Component } from '@angular/core';
import { Icon } from '../icon/icon';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [Icon, TranslatePipe],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {}
