import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { MeetupService } from '../../../provider/meetup.service';

@Component({
    selector: 'booking-detail',
    templateUrl: 'booking-detail.component.html',
    styleUrls: ['booking-detail.component.css'],
})
export class BookingDetailComponent {

    showViewSection: boolean;
    showEditSection: boolean;

    constructor() {
        this.showViewSection = true;
    }
    showEditSectionContainer() {
        this.showEditSection = true;
        this.showViewSection = false;
    }
    showViewSectionContainer() {
        this.showEditSection = false;
        this.showViewSection = true;
    }
}