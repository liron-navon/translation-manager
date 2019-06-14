import {Injectable} from '@angular/core';
import {StoreService, StoreKeys} from '../store/store.service';

export enum ThemesEnum {
  dark = 'dark-theme',
  light = 'light-theme',
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  activeTheme: ThemesEnum;

  constructor(private store: StoreService) {
    // load the initial theme, defaults to light
    const theme = this.store.get(StoreKeys.themePreference, ThemesEnum.light);
    this.applyTheme(theme);
  }

  // applies the theme to the UI
  private applyTheme(theme: ThemesEnum) {
    this.activeTheme = theme;
    const rootElement = document.querySelector('app-root');
    rootElement.className = theme;
  }

  // set the theme with persistence
  public setTheme(theme: ThemesEnum) {
    this.applyTheme(theme);
    this.store.set(StoreKeys.themePreference, theme);
  }
}
