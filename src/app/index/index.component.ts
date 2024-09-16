import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import { AngularD3CloudModule } from 'angular-d3-cloud'
import {Content, Page} from "../../common/interfaces/page";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
interface TextCloud {
  text: string;
  value: number;
  uuid: string;
}
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatPaginatorModule, MatTableModule, AngularD3CloudModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  private apiBaseUrl = environment.apiBaseUrl;

  page: Page= {page: 0, pageSize: 15, total: 15};
  data : TextCloud [] = [{"text": "", "value": 1, "uuid": ""}]

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchPageList();
  }

  onWorkClick(event) {
    console.log(event)
    this.router.navigate(['/agent-converse', event.word.uuid, event.word.text]);
  }
  fetchPageList() {
    this.http.post<{ data: Content }>(`${this.apiBaseUrl}/api/v1/agents/list`, this.page).subscribe(
        {
          next: (response) => {
            this.data = response.data.content.map(item => ({
              text: item.name,
              value: 10 + Math.random() * 90,
              uuid: item.uuid
            }));
            this.page.page = response.data.page;
            this.page.pageSize = response.data.pageSize;
            this.page.total = response.data.total;
          },
          error: (e) => console.error(e),
          complete: () => console.info('complete')
        }
    );
  }


}
