import {Component, OnInit} from '@angular/core';
import {TranslationsService} from '../../services/translations/translations.service';
import {TranslationSet} from '../../../../shared/translationInterfaces';
import {setCORS} from 'google-translate-api-browser';
import {TranslateDialogComponent} from '../../components/translate-dialog/translate-dialog.component';
import {MatDialog} from '@angular/material';
import {getLanguageCode} from '../../services/translations/languageCode';
import {escapeHtml} from '../../services/translations/escapeHTML';

@Component({
  selector: 'app-translation-view',
  templateUrl: './translation-view.component.html',
  styleUrls: ['./translation-view.component.scss']
})
export class TranslationViewComponent implements OnInit {
  constructor(public translationsService: TranslationsService, public dialog: MatDialog) {
  }

  get notes() {
    return this.translationsService.activeTranslationSet &&
      this.translationsService.activeTranslationSet.find(({language}) =>
      language === this.translationsService.config.notesFileName);
  }

  ngOnInit() {
  }


  openTranslateDialog(translatelanguage): void {
    const dialogRef = this.dialog.open(TranslateDialogComponent, {
      width: '300px',
      data: {translateTo: translatelanguage}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.translate(result);
      }
    });
  }

  translate(translationData): void {
    const activeTranslationSet: TranslationSet[] = this.translationsService.activeTranslationSet;
    activeTranslationSet.forEach(async (set: TranslationSet) => {
        if (set.language === translationData.translateTo) {
          const translate = setCORS('http://cors-anywhere.herokuapp.com/');
          const result: any = await translate(set.value, { to: getLanguageCode(translationData.translateTo) });
          if (result) {
            this.translationsService.onTranslationInput(set.language, escapeHtml(result.text));
          }
        }
    });
  }

}
