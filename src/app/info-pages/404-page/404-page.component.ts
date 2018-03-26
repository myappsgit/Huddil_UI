import { Component } from '@angular/core';

@Component({
    selector: 'not-found',
    templateUrl: './404-page.component.html',
    styleUrls: ['./404-page.component.css']
})
export class NotFoundComponent {

    goBack() {
        window.history.back();
    }
}