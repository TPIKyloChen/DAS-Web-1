import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import { ChatNewComponent } from './chat-new/chat-new.component';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import { MarkdownModule } from "ngx-markdown";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LoadingInterceptor} from "../common/service/loading.interceptor";
import {NgOptimizedImage} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MarkdownModule.forRoot(),
        MatProgressSpinnerModule,
        NgOptimizedImage,
        MatSnackBarModule,
        MatDialogModule
    ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    ConfirmDialogComponent
  ],
    providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true,
}],
  bootstrap: [AppComponent]
})
export class AppModule { }
