import {Component, inject, OnInit} from '@angular/core';

import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {Model} from "../../common/interfaces/model";
@Component({
  selector: 'dialog-overview-example-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    NgForOf,
    NgIf
  ],
  template: `
    <h1 mat-dialog-title>新增AI模型</h1>
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>名稱</mat-label>
        <input matInput [(ngModel)]="data.name" required>
      </mat-form-field>
      <div class="dropdown-item">
        <mat-form-field appearance="fill">
          <mat-label>類型</mat-label>
          <mat-select [(value)]="typeSelectedOption" required>
            <mat-option *ngFor="let option of typeOptions" [value]="option" >{{option}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="dropdown-item">
        <mat-form-field appearance="fill">
          <mat-label>平台</mat-label>
          <mat-select [(value)]="platformSelectedOption"  (selectionChange)="onSelect($event.value)" required>
            <mat-option *ngFor="let option of platformOptions" [value]="option">{{option}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div *ngIf="platformSelectedOption === 'OPENAI'" class="fields-container">
        <mat-form-field>
          <mat-label>API Key</mat-label>
          <input matInput [(ngModel)]="data.apiKey" required>
        </mat-form-field>
      </div>
      <div *ngIf="platformSelectedOption === 'OLLAMA'" class="fields-container">
        <mat-form-field>
          <mat-label>Base Url</mat-label>
          <input matInput [(ngModel)]="data.baseUrl" required>
        </mat-form-field>
      </div>
      <div *ngIf="platformSelectedOption === 'VERTEX'" class="fields-container">
        <mat-form-field>
          <mat-label>Project ID</mat-label>
          <input matInput [(ngModel)]="data.projectId" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Location</mat-label>
          <input matInput [(ngModel)]="data.location" required>
        </mat-form-field>
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">取消</button>
      <button mat-button [mat-dialog-close]="data" >新增</button>
    </div>
  `
})
export class ModelCreateDialog {
  readonly dialogRef = inject(MatDialogRef<ModelCreateDialog>);
  readonly data = inject<Model>(MAT_DIALOG_DATA);
  typeOptions: string[] = ["CHAT"];
  typeSelectedOption: string;
  platformOptions: string[] = ["OPENAI","VERTEX", "OLLAMA"];
  platformSelectedOption: string;
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSelect(optionValue: any): void {
    this.data.platform = this.platformSelectedOption;
    this.data.type = this.typeSelectedOption;
  }
}