import { Injectable } from '@angular/core';
import * as Store from 'electron-store';

export enum StoreKeys {
  lastItems = 'lastItems-v3',
  themePreference = 'themePreference',
  translationOptions = 'translationOptions'
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  store: Store<any>;
  constructor() {
    this.store = new Store();
  }

  set(key: StoreKeys, value: any) {
    return this.store.set(key, value);
  }

  get<T = any>(key: StoreKeys, defaultValue: any): T {
    return this.store.get(key, defaultValue) as T;
  }
}
