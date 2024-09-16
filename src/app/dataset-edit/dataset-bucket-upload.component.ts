import {Component, inject, OnInit} from '@angular/core';

import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {Prompt} from "../../common/interfaces/prompt";
import { Bucket } from "../../common/interfaces/bucket";
@Component({
  selector: 'dialog-overview-example-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h1 mat-dialog-title>從 Bucket 上傳檔案</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>Bucket 路徑</mat-label>
        <input matInput [(ngModel)]="data.bucketPath" required>
      </mat-form-field>
      <span ngNonBindable style="font-size: 12px;">⚠️ 注意：路徑需為 GsUtilUri 格式 (ex. <code>gs://demo-bucket/demo.pdf</code>)</span>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">取消</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>新增</button>
    </div>
  `
})
export class BucketUploadDialog {
  readonly dialogRef = inject(MatDialogRef<BucketUploadDialog>);
  readonly data = inject<Bucket>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}