import 'reflect-metadata';
import '../polyfills';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {HttpClientModule, HttpClient} from '@angular/common/http';

import {AppRoutingModule} from './modules/app-routing.module';

// NG Translate
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {ElectronService} from './providers/electron.service';

import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialComponentsModule} from './modules/material-components.module';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {ItemSelectorMenuComponent} from './components/item-selector-menu/item-selector-menu.component';
import {TranslationViewComponent} from './views/translation-view/translation-view.component';
import {CreateTextDialogComponent} from './components/item-selector-menu/create-text-dialog/create-text-dialog.component';
import {AddLanguageDialogComponent} from './components/toolbar/add-language-dialog/add-language-dialog.component';
import {LocaleNamePipe} from './pipes/locale-name.pipe';
import {ExportPoDialogComponent} from './components/toolbar/export-po-dialog/export-po-dialog.component';
import {ExportAndroidDialogComponent} from './components/toolbar/export-android-dialog/export-android-dialog.component';
import { ProjectSelectorMenuComponent } from './components/project-selector-menu/project-selector-menu.component';
import {TranslateDialogComponent} from './components/translate-dialog/translate-dialog.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const dialogs = [
  CreateTextDialogComponent,
  AddLanguageDialogComponent,
  ExportPoDialogComponent,
  ExportAndroidDialogComponent,
  TranslateDialogComponent
];

const pipes = [
  LocaleNamePipe
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    ItemSelectorMenuComponent,
    TranslationViewComponent,
    CreateTextDialogComponent,
    ...pipes,
    ...dialogs,
    ProjectSelectorMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService],
  entryComponents: [AppComponent, ...dialogs],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
