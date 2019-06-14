import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslationsService} from '../../../services/translations/translations.service';

export interface DialogData {
  [label: string]: string;
}

@Component({
  selector: 'app-dialog-create-text',
  templateUrl: './create-text-dialog.component.html',
  styleUrls: ['./create-text-dialog.component.scss']
})
export class CreateTextDialogComponent {

  constructor(
    public translationsService: TranslationsService,
    public dialogRef: MatDialogRef<CreateTextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    data = {
      key: '',
    };
    translationsService.languages.forEach((lang) => {
      data[lang] = '';
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
