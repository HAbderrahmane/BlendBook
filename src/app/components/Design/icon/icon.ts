import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Icon {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input('');
  readonly size = input(20);
  readonly ariaLabel = input('icon');
  readonly svgContentSafe = signal<SafeHtml>('');

  constructor() {
    effect(() => {
      const iconName = this.name();
      if (!iconName) {
        this.svgContentSafe.set('');
        return;
      }
      this.loadIcon(iconName);
    });
  }

  private loadIcon(iconName: string): void {
    const fileName = iconName.endsWith('.svg') ? iconName : `${iconName}.svg`;
    const directPath = this.assetUrl(fileName);
    const publicPath = this.assetUrl(`public/${fileName}`);

    this.http
      .get(directPath, { responseType: 'text' })
      .pipe(
        catchError(() => this.http.get(publicPath, { responseType: 'text' })),
        catchError(() => of('')),
      )
      .subscribe((svg) => {
        if (!svg) {
          this.svgContentSafe.set('');
          return;
        }
        this.svgContentSafe.set(this.sanitizer.bypassSecurityTrustHtml(svg));
      });
  }

  private assetUrl(path: string): string {
    return new URL(path, this.document.baseURI).toString();
  }
}
