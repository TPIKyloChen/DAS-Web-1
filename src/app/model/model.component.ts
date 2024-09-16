import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ModelCreateDialog} from "./model-create.component";
import {Model} from "../../common/interfaces/model";
import {Content, Page} from "../../common/interfaces/page";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-model',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatDialogModule],
    templateUrl: './model.component.html',
    styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit {
    data: Model[];
    page: Page = {page: 0, pageSize: 5, total: 10};
    title: string = 'AI模型'
    private apiBaseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient, public dialog: MatDialog) {
    }


    ngOnInit(): void {
        this.fetchPageList()
    }

    onPageChange(event: PageEvent) {

        this.page.page = event.pageIndex;
        this.page.pageSize = event.pageSize;


        this.fetchPageList();
    }

    deleteElement(element: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                message: '你確定要刪除這個模型嗎？',
                callback: this.delete.bind(this, element.uuid)
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.changed) {
                this.fetchPageList();
            }
        });
    }

    delete(uuid: string) {
        const request =
            {
                "uuid": uuid
            }
        this.http.post(`${this.apiBaseUrl}/api/v1/models/delete`, request).subscribe(
            {
                next: (response) => {
                    this.ngOnInit();
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    create() {
        const dialogRef = this.dialog.open(ModelCreateDialog, {
            width: '350px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.add(result);
            }
        });
    }

    fetchPageList() {
        this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/models/list`, this.page).subscribe(
            {
                next: (response) => {
                    this.data = response.data.content;
                    this.page.page = response.data.page;
                    this.page.pageSize = response.data.pageSize;
                    this.page.total = response.data.total;
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }


    add(data: any) {
        const request =
            {
                "name": data.name,
                "type": data.type,
                "platform": data.platform,
                "projectId": data.projectId,
                "location": data.location,
                "baseUrl": data.apiBaseUrl,
                "apiKey": data.apiKey
            }
        this.http.post(`${this.apiBaseUrl}/api/v1/models/add`, request).subscribe(
            {
                next: (response) => {
                    this.ngOnInit();
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

}
