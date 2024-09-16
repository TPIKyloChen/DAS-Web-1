import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {AgentCreateDialog} from "./agent-create.component";
import {Page, Content} from "../../common/interfaces/page";
import {AgentEditDialog} from "./agent-edit.component";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-agent',
  standalone: true,
    imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatTableModule, MatDialogModule],
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;

  data: Content[]
  page: Page= {page: 0, pageSize: 5, total: 10};
  title: string = '助理'
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

  editElement(element: any) {
    const dialogRef = this.dialog.open(AgentEditDialog, {
      width: '350px',
      data: { uuid: element.uuid }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.changed) {
        this.fetchPageList();
      }
    });
  }
  create(){
    const dialogRef = this.dialog.open(AgentCreateDialog, {
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
    this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/agents/list`, this.page).subscribe(
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
    this.router.navigate(['/chat-new', element.uuid, element.name]);
  }

  add(data: any) {
    const request = {"name": data.name, "modelUuid": data.modelUuid, "promptUuid": data.promptUuid, "datasetUuid": data.datasetUuid }
    this.http.post(`${this.apiBaseUrl}/api/v1/agents/add`, request).subscribe(
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
