import {Component, inject} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

interface DatasetDialogData {
    store_key: string;
}

@Component({
    selector: 'dialog-overview-example-dialog',
    standalone: true,
    imports: [
        MatInputModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule
    ],
    template: `
        <h1 mat-dialog-title>新增資料集</h1>
        <div mat-dialog-content>
            <mat-form-field>
                <mat-label>Store Key</mat-label>
                <input matInput [(ngModel)]="data.store_key" required>
            </mat-form-field>
        </div>
        <div mat-dialog-actions>
            <button mat-button (click)="onNoClick()">取消</button>
            <button mat-button [mat-dialog-close]="data" cdkFocusInitial>新增</button>
        </div>
    `
})
export class DatasetAddDialog {
    readonly dialogRef = inject(MatDialogRef<DatasetAddDialog>);
    readonly data = inject<DatasetDialogData>(MAT_DIALOG_DATA);

    onNoClick(): void {
        this.dialogRef.close();
    }
}