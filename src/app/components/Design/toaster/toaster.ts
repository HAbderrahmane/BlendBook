import { Component, inject } from '@angular/core';
import { ToastService } from '../../../Services/toast.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './toaster.html',
  styleUrl: './toaster.scss',
})
export class Toaster {
  readonly toastService = inject(ToastService);
}
