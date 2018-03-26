import { Component, Input } from '@angular/core';

@Component({
    selector: 'facility-reviews',
    templateUrl: 'reviews.component.html',
    styleUrls: ['reviews.component.css']
})

export class ReviewsComponent {
    @Input() facilityReviewsData;

    ngOnInit() {
    }
}