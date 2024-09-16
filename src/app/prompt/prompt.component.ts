import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {PromptCreateDialog} from "./prompt-create.component";
import {Content, Page} from "../../common/interfaces/page";
import {PromptEditDialog} from "./prompt-edit.component";
import {Prompt} from "../../common/interfaces/prompt";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import {environment} from "../../environments/environment";

@Component({
    selector: 'app-prompt',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatDialogModule],
    templateUrl: './prompt.component.html',
    styleUrls: ['./prompt.component.css']
})
export class PromptComponent implements OnInit {
    private apiBaseUrl = environment.apiBaseUrl;

    data: Content[];
    page: Page = {page: 0, pageSize: 5, total: 10};
    title: string = '提示詞'

    constructor(private http: HttpClient,
                public dialog: MatDialog) {
    }


    ngOnInit(): void {
        this.fetchPageList()
    }

    onPageChange(event: PageEvent) {
        this.page.page = event.pageIndex;
        this.page.pageSize = event.pageSize;

        this.fetchPageList();
    }

    editElement(element: any) {
        const request = {
            "uuid": element.uuid
        }

        this.http.post<{ data: Prompt }>(`${this.apiBaseUrl}/api/v1/prompts/get`, request).subscribe(
            {
                next: (response) => {
                    const dialogRef = this.dialog.open(PromptEditDialog, {
                        width: '600px',
                        height: '650px',
                        data: response.data
                    });

                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            this.edit(result);
                        }
                    });
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    edit(data: any) {
        const request = {
            "uuid": data.uuid,
            "name": data.name,
            "description": data.description,
            "content": data.content
        }
        this.http.post(`${this.apiBaseUrl}/api/v1/prompts/edit`, request).subscribe(
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
        const dialogRef = this.dialog.open(PromptCreateDialog, {
            width: '600px',
            height: '650px',
            data: {store_key: ''}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.add(result);
            }
        });
    }

    fetchPageList() {
        this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/prompts/list`, this.page).subscribe(
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
        const request = {"name": data.name, "description": data.description, "content": data.content}
        this.http.post(`${this.apiBaseUrl}/api/v1/prompts/add`, request).subscribe(
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
                message: '你確定要刪除這個提示詞嗎？',
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
        this.http.post(`${this.apiBaseUrl}/api/v1/prompts/delete`, request).subscribe(
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
