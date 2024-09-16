import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {Page, Content} from "../../common/interfaces/page";
import {environment} from "../../environments/environment";
import { ChatDetailDialog } from "./chat-detail.component";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-chat',
  standalone: true,
    imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatDialogModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;

  data: Content[]
  page: Page= {page: 0, pageSize: 5, total: 10};
  title: string = '聊天'
  constructor(private http: HttpClient, private router: Router,
              public dialog: MatDialog) {}


  ngOnInit(): void {
    this.fetchPageList()
  }
  onPageChange(event: PageEvent) {

    this.page.page = event.pageIndex;
    this.page.pageSize = event.pageSize;

    this.fetchPageList();
  }

  fetchPageList() {
    this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/chats/list`, this.page).subscribe(
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

  converse(element: any) {
    this.router.navigate(['/chat', element.uuid, element.name]);
  }

  detail(element: any) {
    const dialogRef = this.dialog.open(ChatDetailDialog, {
      width: '350px',
      data: { chatUuid: element.uuid }
    });

    console.info(element)

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.changed) {
        this.fetchPageList();
      }
    });
  }

  delete(element: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '你確定要刪除這個聊天室嗎？',
        callback: this.callDeleteApi.bind(this, element)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.changed) {
        this.fetchPageList();
      }
    });
  }

  callDeleteApi(element: any) {
    const request = {
      "uuid": element.uuid
    }

    console.info(element)

    this.http.post<{ data: string }>(`${this.apiBaseUrl}/api/v1/chats/delete`, request).subscribe(
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
