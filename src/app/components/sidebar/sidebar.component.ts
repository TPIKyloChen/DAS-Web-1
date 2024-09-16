import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";

declare const $: any;

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    {path: '/chat', title: '聊天', icon: 'chat', class: ''},
    {path: '/agent', title: '助理', icon: 'dashboard', class: ''},
    {path: '/model', title: 'AI模型', icon: 'person', class: ''},
    {path: '/dataset', title: '知識庫', icon: 'content_paste', class: ''},
    {path: '/prompt', title: '提示詞', icon: 'library_books', class: ''},
    {path: '/image', title: '生成圖片', icon: 'image', class: ''},
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];
    baseUrl: string = environment.baseUrl;

    constructor() {
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
}
