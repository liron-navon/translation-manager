import { Component } from '@angular/core';
import { ElectronService } from './providers/electron.service';
import { TranslateService } from '@ngx-translate/core';
import {TranslationsService} from './services/translations/translations.service';
// import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    public translationsService: TranslationsService,
    public translate: TranslateService) {

    translate.setDefaultLang('en');
    // console.log('AppConfig', AppConfig);

    // if (electronService.isElectron()) {
    //   console.log('Mode electron');
    //   console.log('Electron ipcRenderer', electronService.ipcRenderer);
    //   console.log('NodeJS childProcess', electronService.childProcess);
    // } else {
    //   console.log('Mode web');
    // }
  }
}
