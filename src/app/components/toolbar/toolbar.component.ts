import {Component, OnInit, OnDestroy} from '@angular/core';
import {TranslationsService} from '../../services/translations/translations.service';
import {MatDialog, MatIconRegistry, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {CsvService} from '../../services/csv/csv.service';
import {ThemesEnum, ThemeService} from '../../services/theme/theme.service';
import {AddLanguageDialogComponent} from './add-language-dialog/add-language-dialog.component';
import {ExportPoDialogComponent} from './export-po-dialog/export-po-dialog.component';
import {ExportAndroidDialogComponent} from './export-android-dialog/export-android-dialog.component';
import Mousetrap from 'mousetrap';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  isLoading: boolean;

  constructor(
    public snackBar: MatSnackBar,
    public translation: TranslationsService,
    public registry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    public csvService: CsvService,
    public themeService: ThemeService,
    public dialog: MatDialog
  ) {
    registry.addSvgIcon('app_icon_csv_download', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/csv_download.svg'));
    registry.addSvgIcon('app_icon_csv_upload', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/csv_upload.svg'));
    registry.addSvgIcon('app_icon_po_file_import', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/po_file_import.svg'));
    registry.addSvgIcon('app_icon_po_file_export', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/po_file_export.svg'));
  }

  ngOnInit() {
    this.registerShortcuts();
  }

  ngOnDestroy(): void {
    this.removeShortcuts();
  }

  showError(errorMessage: string) {
    this.snackBar.open(errorMessage, null, {
      panelClass: ['snackbar-error'],
      duration: 2000
    });
  }

  showMessage(message: string) {
    this.snackBar.open(message, null, {
      panelClass: ['snackbar-success'],
      duration: 2000
    });
  }

  handlePromise(promise: Promise<any>, errorMessage: string, successMessage: string) {
    this.isLoading = true;
    promise
      .then(() => this.showMessage(successMessage))
      .catch((error) => {
        console.error(error);
        this.showError(errorMessage ? errorMessage : error.message);
      })
      .then(() => {
        this.isLoading = false;
      });
  }

  onDarkThemeToggle(on: boolean) {
    this.themeService.setTheme(on ? ThemesEnum.dark : ThemesEnum.light);
  }

  openProject(path?: string) {
    path
      ? this.handlePromise(
      this.translation.openProjectToTranslate(path),
      'Failed to load project',
      'Loaded project'
      )
      : this.handlePromise(
      this.translation.selectProjectToTranslate(),
      'Failed to load project',
      'Loaded project'
      );
  }

  selectFolder() {
    this.handlePromise(
      this.translation.selectProjectToTranslate(),
      'Failed to load files',
      'Loaded project'
    );
  }

  openCollection(path?: string) {
    this.handlePromise(
      this.translation.selectCollection(path),
      'Failed to load collection',
      'Loaded collection'
    );
  }

  saveChanges() {
    this.handlePromise(
      this.translation.saveChanges(),
      null,
      'Saved changes'
    );
  }

  uploadCSV() {
    this.handlePromise(
      this.csvService.importCSV(),
      'Failed import CSV',
      'Imported CSV'
    );
  }

  downloadCSV() {
    this.handlePromise(
      this.csvService.createCSVExport(),
      'Failed to export CSV file',
      'File saved'
    );
  }

  // open a dialog to create a new language
  openAddLanguageDialog(): void {
    const dialogRef = this.dialog.open(AddLanguageDialogComponent, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addLanguage(result);
      }
    });
  }

  // adds a new language to the translation service (call saveChanges to persist on disk)
  addLanguage(languageSpec: { language: string, defaultTo: string }) {
    const {language, defaultTo} = languageSpec;

    if (this.translation.languages.includes(language)) {
      this.showError(`The language "${language}" already exist`);
      return;
    }
    this.handlePromise(
      this.translation.addNewLanguage(language, defaultTo),
      'Failed to add language',
      'Language added'
    );
  }

  get isDarkTheme() {
    return this.themeService.activeTheme === ThemesEnum.dark;
  }

  importPO() {
    this.handlePromise(
      this.translation.importPO(),
      null,
      'File imported'
    );
  }

  openExportPoDialog() {
    const dialogRef = this.dialog.open(ExportPoDialogComponent, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handlePromise(
          this.translation.exportPO(result.from, result.to),
          null,
          'File exported'
        );
      }
    });
  }

  registerShortcuts() {
    Mousetrap.bind(['command+s', 'ctrl+s'], () => {
      console.log('saving????');
      this.saveChanges();
    });
    Mousetrap.bind(['command+shift+p', 'ctrl+shift+p'], () => {
      this.selectFolder();
    });
  }

  removeShortcuts() {
    Mousetrap.unbind(['command+s', 'ctrl+s']);
    Mousetrap.unbind(['command+shift+p', 'ctrl+shift+p']);
  }

  openAndroidDialog() {
    const dialogRef = this.dialog.open(ExportAndroidDialogComponent, {
      width: '300px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const {language, isImport} = result;
        console.log('isImport', isImport);
        this.handlePromise(
          isImport
            ? this.translation.importAndroidXMLFile(language)
            : this.translation.exportAndroidXMLFile(language),
          null,
          isImport ? 'Successfully imported file' : 'Successfully exported file'
        );
      }
    });
  }
}
