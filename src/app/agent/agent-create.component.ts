import {Component, inject, OnInit} from '@angular/core';

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
import {AgentCreate} from "../../common/interfaces/agentCreate";
import {Model} from "../../common/interfaces/model";
import {Dataset} from "../../common/interfaces/dataset";
import {Prompt} from "../../common/interfaces/prompt";
import {Page, Content} from "../../common/interfaces/page";
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
        <h1 mat-dialog-title>新增助理</h1>
        <div mat-dialog-content>
            <mat-form-field>
                <mat-label>名稱</mat-label>
                <input matInput [(ngModel)]="data.name" required>
            </mat-form-field>
            <div class="dropdown-item">
                <mat-form-field>
                    <mat-label>模型</mat-label>
                    <mat-select [(value)]="modelSelectedOption" (selectionChange)="onSelect($event.value)" required>
                        <mat-option *ngFor="let option of modelOptions" [value]="option">{{ option.name }}</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
            <div class="dropdown-item">
                <mat-form-field>
                    <mat-label>提示詞</mat-label>
                    <mat-select [(value)]="promptSelectedOption" (selectionChange)="onSelect($event.value)" required>
                        <mat-option *ngFor="let option of promptOptions" [value]="option">{{ option.name }}</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
            <div class="dropdown-item">
                <mat-form-field>
                    <mat-label>知識庫</mat-label>
                    <mat-select [(value)]="datasetSelectedOption" (selectionChange)="onSelect($event.value)" required>
                        <mat-option *ngFor="let option of datasetOptions" [value]="option">{{ option.name }}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
        </div>
        <div mat-dialog-actions>
            <button mat-button (click)="onNoClick()">取消</button>
            <button mat-button [mat-dialog-close]="data">新增</button>
        </div>
    `
})
export class AgentCreateDialog implements OnInit {
    constructor(private http: HttpClient) {
    }
    private apiBaseUrl = environment.apiBaseUrl;

    readonly dialogRef = inject(MatDialogRef<AgentCreateDialog>);
    readonly data = inject<AgentCreate>(MAT_DIALOG_DATA);
    modelOptions: Model[] = [];
    datasetOptions: Dataset[] = [];
    promptOptions: Prompt[] = [];
    page: Page = {page: 0, pageSize: 20, total: 100};

    modelSelectedOption: Model;
    datasetSelectedOption: Dataset;
    promptSelectedOption: Prompt;

    ngOnInit(): void {
        this.fetchPageList()
    }

    fetchPageList() {
        this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/models/list`, this.page).subscribe(
            {
                next: (response) => {
                    this.modelOptions = response.data.content;
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
        this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/datasets/list`, this.page).subscribe(
            {
                next: (response) => {
                    this.datasetOptions = response.data.content;
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
         this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/prompts/list`, this.page).subscribe(
             {
               next: (response) => {
                 this.promptOptions = response.data.content;
               },
               error: (e) => console.error(e),
               complete: () => console.info('complete')
             }
         );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSelect(option: any): void {
        this.data.modelUuid = this.modelSelectedOption? this.modelSelectedOption.uuid:undefined;
        this.data.datasetUuid = this.datasetSelectedOption ? this.datasetSelectedOption.uuid : undefined;
        this.data.promptUuid = this.promptSelectedOption ? this.promptSelectedOption.uuid : undefined;
    }
}