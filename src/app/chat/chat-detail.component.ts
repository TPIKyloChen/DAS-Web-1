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
import { ChatDetail } from "../../common/interfaces/chatDetail";


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
        <h1 mat-dialog-title>聊天室資訊</h1>
        <div mat-dialog-content>
            <mat-form-field>
                <mat-label>聊天室</mat-label>
                <input matInput [(ngModel)]="chatName" disabled>
            </mat-form-field>
            <mat-form-field>
                <mat-label>助理</mat-label>
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
            <button mat-button class="btn btn-default pull-right" (click)="onNoClick()">取消</button>
        </div>
    `
})
export class ChatDetailDialog implements OnInit {
    constructor(private http: HttpClient, private dialog: MatDialog) {
    }
    private apiBaseUrl = environment.apiBaseUrl;

    readonly dialogRef = inject(MatDialogRef<ChatDetailDialog>);
    readonly data = inject<any>(MAT_DIALOG_DATA);
    chatUuid: string;
    chatName: string;
    agent: Agent;

    ngOnInit(): void {
        this.chatUuid = this.data.chatUuid;
        this.getChatDetail()
    }

    getChatDetail(){
        const request = {
            "chatUuid": this.chatUuid
        }
        this.http.post<{ data: ChatDetail }>(`${this.apiBaseUrl}/api/v1/chats/get-detail`, request).subscribe(
            {
                next: (response) => {
                    console.info(response)
                    this.agent = response.data.agent;
                    this.chatName = response.data.name;
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    onNoClick(): void {
        this.dialogRef.close({
            changed: false
        });
    }

    protected readonly name = name;
}