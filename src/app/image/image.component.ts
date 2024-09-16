import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MarkdownModule} from "ngx-markdown";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {finalize} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-image',
  standalone: true,
    imports: [CommonModule, MarkdownModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, NgOptimizedImage],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  title = '生成圖片';
  userInput: string =''
  isSending=false;
  base64Image: string = './assets/img/myth.jpg'; // 用於存儲Base64圖片數據

    private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

    openImageInNewTab() {
        const imageUrl = 'https://via.placeholder.com/300'; // 使用您實際的圖片 URL
        window.open(imageUrl, '_blank');
    }

  sendMessage() {

    if (this.userInput == '') {
      return
    }

    const request = {
      "prompt": this.userInput
    }

    this.isSending = true;
    this.http.post<{ data: string }>(`${this.apiBaseUrl}/api/v1/images/generate`, request).pipe(
        // finalize 操作符在請求完成後執行
        finalize(() => {
          // 在這裡放置你希望無論如何都會執行的代碼
          this.isSending = false;
        })
    ).subscribe(
        {
          next: (response) => {
              this.base64Image = `data:image/jpeg;base64,${response.data}`;  // 將返回的圖片數據存儲為 base64
          },
          error: (e) => {
            console.error(e)
          },
          complete: () => console.info('complete')
        }
    );
  }

}
