import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {LoadingService} from "./loading";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private loadingService: LoadingService, private snackBar: MatSnackBar) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // 仅对特定 URL 或条件显示加载动画

        const shouldShowLoading = req.url.includes('/api/v1/chats/create')
            || req.url.includes('/api/v1/chats/converse'); // 或其他判断条件

        if (shouldShowLoading) {
        }else{
            this.loadingService.show();
        }


        // 可能可以在這邊加baseUrl
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '請求失敗，請稍後再試';

                // 根據錯誤狀態碼或錯誤信息自定義錯誤提示
                if (error.status === 0) {
                    errorMessage = '無法連接到服務器，請檢查您的網絡';
                } else if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                }

                this.snackBar.open(errorMessage, '關閉', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });

                return throwError(error);
            }),
            finalize(() => {
                this.loadingService.hide();

            })
        );
    }
}
