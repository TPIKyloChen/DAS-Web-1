import {Component, inject, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {NgForOf} from '@angular/common';
import {HttpClient} from '@angular/common/http';

import {MatButtonModule} from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef
} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {Content} from "../../common/interfaces/page";
import {Agent} from "../../common/interfaces/agent";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {environment} from "../../environments/environment";


@Component({
    selector: 'dialog-overview-example-dialog',
    standalone: true,
    imports: [
        MatInputModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        NgForOf
    ],
    template: `
        <h1 mat-dialog-title>編輯助理</h1>
        <div mat-dialog-content>
            <mat-form-field>
                <mat-label>名稱</mat-label>
                <input matInput [(ngModel)]="agent.name" disabled>
            </mat-form-field>
            <mat-form-field>
                <mat-label>模型</mat-label>
                <input matInput [(ngModel)]="agent.model.name" disabled>
            </mat-form-field>
            <mat-form-field>
                <mat-label>提示詞</mat-label>
                <input matInput [(ngModel)]="agent.prompt.name" disabled>
            </mat-form-field>
            <mat-form-field>
                <mat-label>知識庫</mat-label>
                <input matInput [(ngModel)]="agent.dataset.name" disabled>
            </mat-form-field>
        </div>
        <div mat-dialog-actions>
            <button mat-button class="btn btn-danger pull-left" (click)="onDelClick()">刪除</button>
            <button mat-button class="btn btn-default pull-right" (click)="onNoClick()">取消</button>
        </div>
    `
})
export class AgentEditDialog implements OnInit {
    constructor(private http: HttpClient, private dialog: MatDialog) {
    }
    private apiBaseUrl = environment.apiBaseUrl;

    readonly dialogRef = inject(MatDialogRef<AgentEditDialog>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    uuid: string;
    agent: Agent;

    ngOnInit(): void {
        this.uuid = this.data.uuid;
        this.fetchData()
    }

    fetchData() {
        this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/agents/get`, {
            uuid: this.uuid
        }).subscribe(
            {
                next: (response) => {
                    this.agent = response.data as Object as Agent;
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    onDelClick(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                message: '你確定要刪除這個助理嗎？',
                callback: this.onDelConfirm.bind(this)
            }
        });
    }

    onNoClick(): void {
        this.dialogRef.close({
            changed: false
        });
    }

    onDelConfirm(): void {
        this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/agents/delete`, {
            uuid: this.uuid
        }).subscribe(
            {
                next: (response) => {
                    this.dialogRef.close({
                        changed: true
                    });
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }
}