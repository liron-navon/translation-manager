import {Component, OnInit} from '@angular/core';
import {TranslationsService} from '../../services/translations/translations.service';

@Component({
  selector: 'app-translation-view',
  templateUrl: './translation-view.component.html',
  styleUrls: ['./translation-view.component.scss']
})
export class TranslationViewComponent implements OnInit {
  constructor(public translationsService: TranslationsService) {
  }

  get notes() {
    return this.translationsService.activeTranslationSet &&
      this.translationsService.activeTranslationSet.find(({language}) =>
      language === this.translationsService.config.notesFileName);
  }

  ngOnInit() {
  }
}
