import { Component } from '@angular/core';
import { MeetupService } from '../../../provider/meetup.service';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'booking-detail',
    templateUrl: './booking-detail.component.html',
    styleUrls: ['./booking-detail.component.css']
})
export class BookingDetailComponent {
    reviewForm: FormGroup
    forCancelPopUp: boolean;
    forReviewPopUp: boolean;

    upComingBookings: any;
    bookingStatus: any;
    cancellationDetails: any
    proceedToCancel: boolean;
    cancelBooking: any;
    showCancelSuccessMsg: boolean;
    ratingValue: number = 1;
    errormsg: any;
    facilityId: any;
    facilityData: any;
    reviewDetails: any = [];
    bookingId: any;
    showReviewBox: boolean;
    reviewComments: any;
    showComments: boolean;
    popupMessage: string = '';
    submitreviewError: boolean;
    constructor(public router: Router, public meetupService: MeetupService, private activatedroute: ActivatedRoute, public fb: FormBuilder) {



        this.reviewForm = fb.group({
            commnentBox: ['', Validators.required]
        })

    }
    ngOnInit() {
        this.bookingStatus = this.activatedroute.snapshot.paramMap.get('type');

        this.activatedroute.queryParams.subscribe(params => {
            this.upComingBookings = params;
            this.facilityId = this.upComingBookings.facilityId;
            this.bookingId = this.bookingStatus == 'history' ? this.upComingBookings.bookingId : this.upComingBookings.id;
        });
        this.forCancelPopUp = false;


        this.meetupService.getfacilityById(this.facilityId).subscribe(res => {
            this.facilityData = JSON.parse(res.text());

        });

        if (this.bookingStatus == 'history') {
            this.getExistingReview();
        }
    }
    getExistingReview() {
        this.meetupService.getExistingReview(this.bookingId).subscribe(res => {
            this.reviewDetails = res

            if (this.reviewDetails.length == 0) {
                this.showReviewBox = true;
            }
            else if (this.reviewDetails.length > 0) {
                this.showComments = true;
            }

        })
    }
    showCancelPopup(id) {
        this.forCancelPopUp = true;
        this.meetupService.calculateCancelCost(id).subscribe(res => {
            this.cancellationDetails = res;

        })
    }
    proceedToCancellation(id) {
        this.proceedToCancel = true;
        this.meetupService.cancelBookingDetails(id).subscribe(res => {
            this.cancelBooking = res;
            let responceCode = res.responseCode;
            switch (responceCode) {
                case '3100':
                    alert('Cancellation failed');
                    break;
                case '3103':
                    alert('Invalid booking id');
                    this.router.navigate(['/consumer/my-bookings']);
                    break;
                case '3105':
                    this.showCancelSuccessMsg = true;
                    alert('Invalid operation type');
                    this.router.navigate(['/consumer/my-bookings']);
                    break;
                case '3106':
                    this.showCancelSuccessMsg = true;
                    alert('Cannot cancel as the payment is in progress');
                    break;
                case '3107':
                    this.showCancelSuccessMsg = true;
                    alert('Cannot cancel as the meeting is in progress');
                    break;
                case '3108':
                    this.showCancelSuccessMsg = true;
                    alert('Booking status is neither confirmed nor pending');
                    break;
                case '3109':
                    this.showCancelSuccessMsg = true;
                    alert('User is not authorized to cancel the booking');
                    this.router.navigate(['/consumer/my-bookings']);
                    break;
                case '3110':
                    this.showCancelSuccessMsg = true;
                    alert('Payment mode is offline, so no refund will be made');
                    break;
                case '3111':
                    this.showCancelSuccessMsg = true;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = "Booking with offline mode is cancelled";


                    break;
                case '3112':
                    this.showCancelSuccessMsg = true;
                    alert('Refund amount is calculated');
                    break;
                case '3113':
                    this.showCancelSuccessMsg = true;
                    alert('Booking is cancelled and refund is inprogress');
                    break;
                case '9996':
                    this.showCancelSuccessMsg = true;
                    alert('User is not allowed to perform this action');
                    break;
                case '9999':
                    this.showCancelSuccessMsg = true;
                    alert('Session invalid/ does not exist');
                    break;
            }
        })
    }
    submitReview(bookingId) {

        let review = this.reviewForm.controls['commnentBox'].value;
        if (review == '') {
            this.submitreviewError = true;
        }
        else {
            this.submitreviewError = false;
            this.meetupService.addReviewsToFacility(review, this.bookingId, this.ratingValue).subscribe(res => {
                this.cancelBooking = res;

                let responceCode = res.headers.get('ResponseCode');
                if (responceCode == "2211") {

                    this.meetupService.isShowPopup = true;

                    this.showReviewBox = false;
                    this.meetupService.popupMessage = 'Thank You for taking your time for the review';
                    this.getExistingReview();

                }
            });
        }
    }
    showRating(value) {
        this.ratingValue = value;
    }
    closePopup() {
        this.meetupService.isShowPopup = false;
        this.router.navigate(['/consumer/my-bookings']);
    }
}