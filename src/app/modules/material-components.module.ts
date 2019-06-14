import {NgModule} from '@angular/core';
import {TextFieldModule} from '@angular/cdk/text-field';
import { QuillModule } from 'ngx-quill';
import { FlexLayoutModule } from '@angular/flex-layout';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatRippleModule,
  MatTooltipModule,
  MatMenuModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatButtonToggleModule
} from '@angular/material';

const materialImports = [
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatRippleModule,
  TextFieldModule,
  MatTooltipModule,
  MatMenuModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  FlexLayoutModule,
  QuillModule
];

@NgModule({
  imports: [...materialImports],
  exports: [...materialImports],
})
export class MaterialComponentsModule { }
