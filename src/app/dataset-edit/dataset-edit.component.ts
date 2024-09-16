import {Component, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {DataText} from "../../common/interfaces/dataText";
import {Content, Page} from "../../common/interfaces/page";
import {MatIconModule} from "@angular/material/icon";
import {environment} from "../../environments/environment";
import { DatasetAddDialog } from "../dataset/dataset-add.component";
import { MatDialog } from "@angular/material/dialog";
import { BucketUploadDialog } from "./dataset-bucket-upload.component";

interface DataFileInfo {
    uuid: string;

    fileName: string;

    createdAt: number;

    chunks: number;

    status: string;
}

@Component({
    selector: 'app-dataset-edit',
    standalone: true,
    imports: [CommonModule, MatTabsModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatFormFieldModule, FormsModule, MatInputModule, MatIconModule],
    templateUrl: './dataset-edit.component.html',
    styleUrls: ['./dataset-edit.component.css'],
    providers: [DatePipe]
})
export class DatasetEditComponent implements OnInit {
    private apiBaseUrl = environment.apiBaseUrl;
    uuid: string;
    name: string;
    data: DataText[];
    fileInfo: DataFileInfo[]
    inputText: string;
    selectedFiles: File[] = [];
    page: Page= {page: 0, pageSize: 5, total: 10};

    constructor(private http: HttpClient, private route: ActivatedRoute, private datePipe: DatePipe, public dialog: MatDialog) {
    }
    onPageChange(event: PageEvent) {
        this.page.page = event.pageIndex;
        this.page.pageSize = event.pageSize;
        this.fetchPageList();
    }

    formatTimestamp(timestamp: number): string {
        return this.datePipe.transform(timestamp, 'yyyy-MM-dd HH:mm:ss');
    }

    fetchPageList() {
        const request = {
            page : this.page.page,
            pageSize : this.page.pageSize,
            uuid: this.uuid
        }
        this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/datasets/text/file/list`, request).subscribe(
            {
                next: (response) => {
                    this.fileInfo = response.data.content;
                    this.page.page = response.data.page;
                    this.page.pageSize = response.data.pageSize;
                    this.page.total = response.data.total;
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    ngOnInit(): void {
        this.uuid = this.route.snapshot.paramMap.get("uuid");
        this.name = this.route.snapshot.paramMap.get("name");

        this.fetchDatasetTextList();
        this.fetchPageList();
    }

    uploadBucketElement() {
        const dialogRef = this.dialog.open(BucketUploadDialog, {
            width: '600px',
            data: {}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.uploadBucket(result);
            }
        });
    }

    uploadBucket(data: any) {
        const request = {
            "uuid": this.uuid,
            "bucketPath": data.bucketPath
        }
        this.http.post(`${this.apiBaseUrl}/api/v1/datasets/text/bucket/upload`, request).subscribe(
            {
                next: (response) => {
                    this.ngOnInit();
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    fetchDatasetTextList() {
        const request = {"uuid": this.uuid}
        this.http.post<{ data: DataText[] }>(`${this.apiBaseUrl}/api/v1/datasets/text/get`, request).subscribe(
            {
                next: (response) => {
                    this.data = response.data;
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    delete(element: any) {
        const request = {"uuid": element.uuid}
        this.http.post<{ data: DataText[] }>(`${this.apiBaseUrl}/api/v1/datasets/text/delete`, request).subscribe(
            {
                next: (response) => {
                    this.fetchDatasetTextList();
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    onFileChange(event: any) {
        this.selectedFiles = Array.from(event.target.files);

        if (this.selectedFiles.length === 0){
            return
        }

        const formData = new FormData();

        console.log(event)

        this.selectedFiles.forEach(file => {
            formData.append('files', file, file.name);
        });

        formData.append('uuid', this.uuid);

        this.http.post(`${this.apiBaseUrl}/api/v1/datasets/text/file/upload`, formData).subscribe(
            {
                next: (response) => {
                    this.selectedFiles = []
                    this.ngOnInit();
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    add() {
        const request = {"uuid": this.uuid, "text": this.inputText}
        this.http.post<{ data: DataText[] }>(`${this.apiBaseUrl}/api/v1/datasets/text/add`, request).subscribe(
            {
                next: (response) => {
                    this.fetchDatasetTextList();
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

}
