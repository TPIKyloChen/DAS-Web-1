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
    <h1 mat-dialog-title>編輯提示詞</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>名稱</mat-label>
        <input matInput [(ngModel)]="data.name" required>
      </mat-form-field>
      <mat-form-field>
        <mat-label>說明</mat-label>
        <input matInput [(ngModel)]="data.description">
      </mat-form-field>
      <mat-form-field>
        <mat-label>內容</mat-label>
        <textarea matInput [(ngModel)] ="data.content" rows="10" required></textarea>
      </mat-form-field>
      <span ngNonBindable style="font-size: 12px;">⚠️ 注意：內容需包含 &#123;document} <br/> • &#123;document} 表示資料集內容</span>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">取消</button>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>確定</button>
    </div>
  `
})
export class PromptEditDialog {
  readonly dialogRef = inject(MatDialogRef<PromptEditDialog>);
  readonly data = inject<Prompt>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}