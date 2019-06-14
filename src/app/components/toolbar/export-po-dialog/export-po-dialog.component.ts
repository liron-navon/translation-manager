import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslationsService} from '../../../services/translations/translations.service';

export interface DialogData {
  to: string;
  from: string;
  fromOptions: string[];
  toOption: string[];
}

@Component({
  selector: 'app-dialog-add-language',
  templateUrl: './export-po-dialog.component.html',
  styleUrls: ['./export-po-dialog.component.scss']
})
export class ExportPoDialogComponent {

  constructor(
    public translationsService: TranslationsService,
    public dialogRef: MatDialogRef<ExportPoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    data.to = '';
    data.from = null;
    data.fromOptions = [...translationsService.languages, 'key'];
    data.toOption = translationsService.languages;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
