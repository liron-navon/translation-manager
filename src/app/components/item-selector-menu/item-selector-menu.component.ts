import {Component, OnDestroy, OnInit, NgZone} from '@angular/core';
import {TranslationsService} from '../../services/translations/translations.service';
import {MatDialog} from '@angular/material';
import {CreateTextDialogComponent} from './create-text-dialog/create-text-dialog.component';
import {Kvp} from '../../../../shared/translationInterfaces';
import Mousetrap from 'mousetrap';
import trim from 'lodash/trim';

/**
 * The menu on the left side that allows us to select items
 */
@Component({
  selector: 'app-item-selector-menu',
  templateUrl: './item-selector-menu.component.html',
  styleUrls: ['./item-selector-menu.component.scss']
})
export class ItemSelectorMenuComponent implements OnInit, OnDestroy {
  filterWord = '';
  editMode: boolean;
  changedKeys: Kvp<string> = {};
  languageFilter = {
    language: '',
    languageFilter: ''
  };

  constructor(
    public translationsService: TranslationsService,
    public dialog: MatDialog,
    public zone: NgZone
  ) {
  }

  changeActiveKeyBy(by: number) {
    const keys = this.keywords;
    const currentKeyIndex = keys.findIndex(({key}) => key === this.translationsService.activeKeyword);
    const nextIndex = currentKeyIndex + by;

    // nothing to move to
    if (keys.length <= 1) {
      return;
    }

    const nextKeyword = by > 0
      ? nextIndex < keys.length ? keys[nextIndex] : keys[0]
      : nextIndex >= 0 ? keys[nextIndex] : keys[keys.length - 1];
    this.translationsService.selectActiveKeyword(nextKeyword.key);
  }

  registerShortcuts() {
    // since this is called inside mousetrap, angular won't pick the change, I need to force zone to detect it

    // go to next
    Mousetrap.bind('ctrl+tab', () => this.zone.run(() => this.changeActiveKeyBy(1)));
    // go to previous
    Mousetrap.bind('ctrl+shift+tab', () => this.zone.run(() => this.changeActiveKeyBy(-1)));
  }

  removeShortcuts() {
    Mousetrap.unbind('ctrl+tab');
    Mousetrap.unbind('ctrl+shift+tab');
  }

  ngOnDestroy(): void {
    this.removeShortcuts();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTextDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.translationsService.addText(result);
      }
    });
  }

  get keywords() {
    if (!this.translationsService.hasLoadedProject) {
      return [];
    }
    let list = this.translationsService.keywords;

    // filter by keywords
    if (this.filterWord) {
      const filter = this.filterWord.toLowerCase();
      list = list.filter(({ key }) => {
        return key.toLowerCase().includes(filter);
      });
    }

    // filter by text in a translation
    const {languageFilter, language} = this.languageFilter;
    if (languageFilter && language) {
      const filter = trim(languageFilter).toLowerCase();
      list = list.filter(({ key }) => {
        return this.translationsService.project.files[language].content[key].toLowerCase().includes(filter);
      });
    }

    // need to rethink this?
    // sort keywords (missingTranslation always on top)
    // list = list.sort((a, b) => {
    //   return (a.missingTranslation === b.missingTranslation)
    //     ? 0
    //     : a.missingTranslation
    //       ? -1
    //       : 1;
    // });
    return list;
  }

  deleteKeyword(key: string) {
    this.translationsService.deleteKeyword(key);
  }

  onKeyChange(key: string, value: string) {
    this.changedKeys[key] = value;
  }

  toggleEditMode() {
    if (this.editMode === true && Object.keys(this.changedKeys).length > 0) {
      this.translationsService.updateKeys(this.changedKeys);
    }
    this.editMode = !this.editMode;
    this.changedKeys = {};
  }

  ngOnInit() {
    this.registerShortcuts();
  }
}
