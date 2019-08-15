import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslationsService} from '../../services/translations/translations.service';

export interface DialogData {
  translateAll: boolean;
  translateFrom: string;
  translateTo: string;
  languages: string[];
}

@Component({
  selector: 'app-dialog-translate',
  templateUrl: './translate-dialog.component.html',
  styleUrls: ['./translate-dialog.component.scss']
})
export class TranslateDialogComponent {


  constructor(
    public translationsService: TranslationsService,
    public dialogRef: MatDialogRef<TranslateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    data.translateFrom = 'nl-nl';
    data.languages = [...translationsService.languages, 'key', 'none'];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
