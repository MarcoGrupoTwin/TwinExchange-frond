// language.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageSelectorService {
  private selectedLanguage: string;
  languageChanged = new EventEmitter<string>();

  constructor(private translate: TranslateService) {
    this.selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    this.translate.setDefaultLang('en'); // Establecer inglés como idioma predeterminado
    this.translate.use(this.selectedLanguage);
  }

  getSelectedLanguage(): string {
    return this.selectedLanguage;
  }

  changeLanguage(language: string): void {
    this.selectedLanguage = language;
    localStorage.setItem('selectedLanguage', language);
    this.translate.use(language);
    this.languageChanged.emit(language);
  }
}