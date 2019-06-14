import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslationsService} from '../../../services/translations/translations.service';

export interface DialogData {
  language: string;
  isImport: boolean;
}

@Component({
  selector: 'app-dialog-add-language',
  templateUrl: './export-android-dialog.component.html',
  styleUrls: ['./export-android-dialog.component.scss']
})
export class ExportAndroidDialogComponent {

  constructor(
    public translationsService: TranslationsService,
    public dialogRef: MatDialogRef<ExportAndroidDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    data.isImport = false;
    data.language = null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
