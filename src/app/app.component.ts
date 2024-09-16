import {Component} from '@angular/core';
import {LoadingService} from "../common/service/loading";
import {environment} from '../environments/environment'


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    loading$ = this.loadingService.loading$;
    apiBaseUrl = environment.apiBaseUrl;

    constructor(private loadingService: LoadingService) {
    }
}
