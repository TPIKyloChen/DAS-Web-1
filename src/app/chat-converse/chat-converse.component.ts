import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {finalize} from "rxjs";
import { MarkdownModule } from "ngx-markdown";
import {environment} from "../../environments/environment";
import { MatIconModule } from '@angular/material/icon';
import { Content } from "../../common/interfaces/page";
import { ChatMessage, ChatMessageList } from "../../common/interfaces/chatMessage";
import { ChatDetail } from "../../common/interfaces/chatDetail";

interface Message {
    content: string;
    sender: 'user' | 'system' | 'system-wait';
}

@Component({
    selector: 'app-chat-converse',
    templateUrl: './chat-converse.component.html',
    standalone: true,
    imports: [
        NgClass,
        MatCardModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatPaginatorModule,
        MatTableModule,
        NgForOf,
        MarkdownModule,
        NgIf,
        MatIconModule,
        NgOptimizedImage
    ],
    styleUrls: ['./chat-converse.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ChatConverseComponent implements OnInit {
    private apiBaseUrl = environment.apiBaseUrl;
    messages: Message[] = [];
    userInput: string = '';
    chatUuid: string;
    chatName: string;
    agentName: string;
    isSending: boolean = false;
    selectedFile: File | null = null;
    filePreviewUrl: string | ArrayBuffer | null = null;
    isImageFile: boolean = false;
    fileIcon: string = '';
    selectedFiles: { file: File, previewUrl: string | ArrayBuffer | null, isImage: boolean, icon: string }[] = [];

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        // 只允許上傳一個檔案，刪除舊檔案
        this.selectedFiles = [];
        if (input.files) {
            Array.from(input.files).forEach(file => {
                this.checkFile(file);
            });
        }
    }

    checkFile(file: File): void {
        const fileObject = { file, previewUrl: null, isImage: false, icon: '' };

        if (file.type.startsWith('image/')) {
            fileObject.isImage = true;
            const reader = new FileReader();
            reader.onload = () => {
                fileObject.previewUrl = reader.result;
                this.selectedFiles.push(fileObject);
            };
            reader.readAsDataURL(file); // 將圖片轉換為 Base64 格式
        } else {
            fileObject.isImage = false;
            fileObject.icon = this.getFileIcon(file.type); // 設置非圖片檔案的圖標
            this.selectedFiles.push(fileObject);
        }
    }
    getFileIcon(fileType: string): string {
        if (fileType.includes('pdf')) {
            return 'picture_as_pdf'; // PDF檔案圖標
        } else if (fileType.includes('word')) {
            return 'description'; // Word檔案圖標
        } else {
            return 'insert_drive_file'; // 通用檔案圖標
        }
    }


    removeFile(fileToRemove: any): void {
        this.selectedFiles = this.selectedFiles.filter(file => file !== fileToRemove);
    }

    constructor(private http: HttpClient, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.chatUuid = this.route.snapshot.paramMap.get("chatUuid");
        this.chatName = this.route.snapshot.paramMap.get("name");
        this.getChatDetail();
        this.fetchChatHistoryList();
    }

    onKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.isComposing && !event.shiftKey) {
            // 當按下「Enter」鍵並且不處於組合輸入狀態時觸發提交
            this.sendMessage();
        }
    }

    getChatDetail(){
        const request = {
            "chatUuid": this.chatUuid
        }
        this.http.post<{ data: ChatDetail }>(`${this.apiBaseUrl}/api/v1/chats/get-detail`, request).subscribe(
            {
                next: (response) => {
                    console.info(response)
                    this.agentName = response.data.agent.name;
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    fetchChatHistoryList() {
        const request = {
            "chatUuid": this.chatUuid,
            "limit": 20
        }
        this.http.post<{ data: ChatMessage[] }>(`${this.apiBaseUrl}/api/v1/chats/messages/list`, request).subscribe(
            {
                next: (response) => {
                    console.info(response)
                    for (const value of response.data) {
                        const sender = value.role === 'USER' ? "user" : "system";
                        this.messages.push(<Message>{content: value.content, sender: sender});
                    }
                },
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
    }

    sendMessage() {

        if (this.userInput == '') {
            return
        }

        const request = {
            "chatUuid": this.chatUuid,
            "userMessage": this.userInput
        }
        this.messages.unshift({content: this.userInput, sender: 'user'});
        this.userInput = '';
        this.isSending = true;
        this.messages.unshift({ content: "", sender: 'system-wait' });
        this.http.post<{ data: ChatMessage }>(`${this.apiBaseUrl}/api/v1/chats/converse`, request).pipe(
            // finalize 操作符在請求完成後執行
            finalize(() => {
                // 在這裡放置你希望無論如何都會執行的代碼
                this.isSending = false;
            })
        ).subscribe(
            {
                next: (response) => {
                    this.messages[0] = { content: response.data.content, sender: 'system' };
                },
                error: (e) => {
                    this.messages[0] = { content: "Error retrieving response", sender: 'system' };
                    console.error(e)
                },
                complete: () => console.info('complete')
            }
        );
    }

    onPaste(event: ClipboardEvent): void {
        const clipboardData = event.clipboardData;
        const items = clipboardData?.items;
        if (items) {
            // 只允許上傳一個檔案，刪除舊檔案
            this.selectedFiles = [];
            Array.from(items).forEach(item => {
                if (item.type.indexOf("image") !== -1) {
                    const file = item.getAsFile();
                    if (file) {
                        this.checkFile(file);
                    }
                }
            });
        }
    }
}
