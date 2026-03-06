import { Injectable, signal } from '@angular/core';
import enTranslations from '../i18n/en.json';
import frTranslations from '../i18n/fr.json';
import { AppLanguage, SUPPORTED_LANGUAGES, TranslationParams } from '../i18n/types';

const TRANSLATIONS: Record<AppLanguage, Record<string, string>> = {
  fr: frTranslations as Record<string, string>,
  en: enTranslations as Record<string, string>,
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'app.language.v1';
  private readonly languageSignal = signal<AppLanguage>(this.readInitialLanguage());

  constructor() {
    this.applyDocumentLanguage(this.languageSignal());
  }

  language() {
    return this.languageSignal();
  }

  languages(): AppLanguage[] {
    return SUPPORTED_LANGUAGES;
  }

  setLanguage(language: AppLanguage): void {
    if (!SUPPORTED_LANGUAGES.includes(language)) return;
    this.languageSignal.set(language);
    this.persistLanguage(language);
    this.applyDocumentLanguage(language);
  }

  t(key: string, params?: TranslationParams): string {
    const language = this.languageSignal();
    const fromCurrent = TRANSLATIONS[language][key];
    const fromFallback = TRANSLATIONS.fr[key];
    const template = fromCurrent ?? fromFallback ?? key;
    return this.interpolate(template, params);
  }

  private interpolate(template: string, params?: TranslationParams): string {
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (_, key: string) => {
      const value = params[key];
      return value == null ? `{${key}}` : String(value);
    });
  }

  private readInitialLanguage(): AppLanguage {
    if (typeof window === 'undefined') return 'fr';

    const stored = window.localStorage.getItem(this.storageKey);
    if (stored === 'fr' || stored === 'en') return stored;

    const navLang = window.navigator.language.toLowerCase();
    return navLang.startsWith('fr') ? 'fr' : 'en';
  }

  private persistLanguage(language: AppLanguage): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(this.storageKey, language);
  }

  private applyDocumentLanguage(language: AppLanguage): void {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
  }
}
