import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslationsService} from '../../../services/translations/translations.service';

export interface DialogData {
  language: string;
  defaultTo: string;
  defaultToOptions: string[];
}

@Component({
  selector: 'app-dialog-add-language',
  templateUrl: './add-language-dialog.component.html',
  styleUrls: ['./add-language-dialog.component.scss']
})
export class AddLanguageDialogComponent {

  constructor(
    public translationsService: TranslationsService,
    public dialogRef: MatDialogRef<AddLanguageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    data.language = '';
    data.defaultTo = 'none';
    data.defaultToOptions = [...translationsService.languages, 'key', 'none'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
