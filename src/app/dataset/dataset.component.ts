import {Component, OnInit} from '@angular/core';

import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {DatasetAddDialog} from "./dataset-add.component";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {Dataset} from "../../common/interfaces/dataset";
import {Page, Content} from "../../common/interfaces/page";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {environment} from '../../environments/environment'


@Component({
    selector: 'app-dataset',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatButtonModule],
    templateUrl: './dataset.component.html',
    styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {
    private apiBaseUrl = environment.apiBaseUrl;

    data: Dataset[] = [];
    page: Page = {page: 0, pageSize: 5, total: 10};
    title: string = '資料集'

    constructor(private http: HttpClient, private router: Router,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        this.fetchPageList();
    }

    onPageChange(event: PageEvent) {

        this.page.page = event.pageIndex;
        this.page.pageSize = event.pageSize;


        this.fetchPageList();
    }

    editElement(element: any) {
        this.router.navigate(['/dataset-edit', element.uuid, element.name]);
    }

    create() {
        const dialogRef = this.dialog.open(DatasetAddDialog, {
            width: '350px',
            data: {store_key: ''}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.add(result);
            }
        });
    }

    fetchPageList() {
        this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/datasets/list`, this.page).subscribe(
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
        const request = {"name": data.store_key, "type": 'text'}
        this.http.post(`${this.apiBaseUrl}/api/v1/datasets/add`, request).subscribe(
            {
                next: (response) => {
                    this.ngOnInit();
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    deleteElement(element: any) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                message: '你確定要刪除這個知識庫嗎？',
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
        this.http.post(`${this.apiBaseUrl}/api/v1/datasets/delete`, request).subscribe(
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
