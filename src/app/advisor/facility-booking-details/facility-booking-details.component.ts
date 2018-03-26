import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'facility-booking',
    templateUrl: 'facility-booking-details.component.html',
    styleUrls: ['facility-booking-details.component.css']
})

export class FacilityBookingComponent {
    bookingId: any;
    bookingStatus: any;
    isSessionExpired: boolean;
    isLoadingData: boolean;
    bookingData: any;
    popupMessage: string = '';
    errorMsz: string = '';
    isProcessStart: boolean;
    showCancellationDetails: boolean;

    constructor(public activatedRoute: ActivatedRoute, public meetupService: MeetupService, public router: Router) {

    }
    ngOnInit() {
        this.bookingId = this.activatedRoute.snapshot.paramMap.get('id');
        this.bookingStatus = this.activatedRoute.snapshot.paramMap.get('status');
        //console.log(this.bookingId);
        //console.log(this.bookingStatus);
        if (this.bookingStatus == '2') {
            this.getCancelledBookingDetail();
            this.showCancellationDetails = true;
        }
        else if (this.bookingStatus == '5') {
            this.getCompletedBookingDetail();
        }
        else {
            this.getBooking();
        }

    }

    getCancelledBookingDetail() {
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            this.isLoadingData = false;
            this.errorMsz = 'You are offline. Please check your network';
        } else {
            this.isLoadingData = true;
            this.meetupService.getCancelledBookingById(this.bookingId).subscribe(response => {
                let responseCode = response.headers.get('ResponseCode');
                this.isLoadingData = false;
                switch (responseCode) {
                    case '3201':
                        this.bookingData = JSON.parse(response.text());
                        //console.log('booking data for cencellation' + this.bookingData);
                        break;
                    case '3202':
                        this.errorMsz = 'There is some technical problem. Please contact administrator.';
                        break;

                    case ('9999'):
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                            this.isSessionExpired = true;
                            this.meetupService.isInvalidSessionPopupDisplayed = true;
                        }
                        break;
                    default:
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Unknown error code' + responseCode;
                            this.isSessionExpired = false;
                        }
                        break;
                }


            });
        }
    }
    getCompletedBookingDetail() {
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            this.isLoadingData = false;
            this.errorMsz = 'You are offline. Please check your network';
        } else {
            this.isLoadingData = true;
            this.meetupService.getCompletedBookingById(this.bookingId).subscribe(response => {
                let responseCode = response.headers.get('ResponseCode');
                this.isLoadingData = false;
                switch (responseCode) {
                    case '2101':
                        this.bookingData = JSON.parse(response.text());
                        console.log(this.bookingData);
                        // this.bookingData = this.bookingData[0];


                        break;
                    case '2102':
                        this.errorMsz = 'There is some technical problem. Please contact administrator.';
                        break;

                    case ('9999'):
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                            this.isSessionExpired = true;
                            this.meetupService.isInvalidSessionPopupDisplayed = true;
                        }
                        break;
                    default:
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Unknown error code' + responseCode;
                            this.isSessionExpired = false;
                        }
                        break;
                }


            });
        }
    }
    getBooking() {
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            this.isLoadingData = false;
            this.errorMsz = 'You are offline. Please check your network';
        } else {
            this.isLoadingData = true;
            this.meetupService.getBookingById(this.bookingId).subscribe(response => {
                let responseCode = response.headers.get('ResponseCode');
                this.isLoadingData = false;
                switch (responseCode) {
                    case '2101':
                        this.bookingData = JSON.parse(response.text());
                        console.log('booking Data' + this.bookingData);
                        this.bookingData = this.bookingData[0];

                        // if (this.bookingData[0].status == this.bookingStatus) {
                        //     this.bookingData = this.bookingData[0];
                        // }
                        // else {
                        //     this.bookingData = this.bookingData[1];
                        // }
                        break;
                    case '2102':
                        this.errorMsz = 'There is some technical problem. Please contact administrator.';
                        break;

                    case ('9999'):
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                            this.isSessionExpired = true;
                            this.meetupService.isInvalidSessionPopupDisplayed = true;
                        }
                        break;
                    default:
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Unknown error code' + responseCode;
                            this.isSessionExpired = false;
                        }
                        break;
                }


            });
        }
    }

    displayStatus(statusId) {

        let status;
        switch (statusId) {
            case '1':
                status = 'Pending';

                break;
            case '2':
                status = 'Cancelled';

                break;
            case '3':
                status = 'Confirmed';
                break;
            case '4':
                status = 'Denied';
                break;
            case '0':
                status = 'In Progess';
                break;
            case '5':
                status = 'Completed';
                break;
        }
        return status;

    }

    updateBookingStatus(status, confirm) {
        this.isProcessStart = true;
        this.meetupService.updateBookingStatusBySP(this.bookingId, status, confirm).subscribe(response => {
            this.isProcessStart = false;
            let responseCode = response.headers.get('ResponseCode');
            let refundableAmount = response.headers.get('RefundAmount');

            switch (responseCode) {
                case '2635':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    if (refundableAmount == null || refundableAmount == '' || refundableAmount == '0.0') {
                        this.meetupService.popupMessage = 'Booking is in ' + this.bookingData.paymentMethod + ' mode. There is no refundable amount.\n Do you want to proceed with the Cancellation.';
                    }
                    else if (refundableAmount != null || refundableAmount != '') {
                        this.meetupService.popupMessage = 'Booking is in ' + this.bookingData.paymentMethod + ' mode. Refundable amount is ' + refundableAmount + '.\n Do you want to proceed with the Cancellation.';
                    }
                    break;
                case '3103':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Invalid booking id';
                    break;
                case '3003':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Invalid facility id';
                    break;
                case '3100':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'There is some technical problem. Please contact administrator.';
                    break;
                case '3111':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = false;
                    this.meetupService.popupMessage = 'Offline booking cancelled successfully';
                    this.router.navigate(['service-provider/booking-history']);
                    break;
                case '3113':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = false;
                    this.meetupService.popupMessage = 'Online booking cancelled successfully';
                    this.router.navigate(['service-provider/booking-history']);
                    break;
                case '2631':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = false;
                    this.meetupService.popupMessage = 'Booking status updated successfully';
                    this.router.navigate(['service-provider/booking-history']);
                    break;
                case '2632':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'There is some technical problem. Please contact administrator.';
                    break;
                default:
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'There is some technical problem. Please contact administrator.';
                    break;
            }


        });
    }

    closePopup(type) {
        if (type == "1") {
            this.meetupService.isShowPopup = false;
            this.meetupService.forceLogoutWithoutSessionId();
            this.router.navigate(['']);
        }
        else if (type == "0") {
            this.meetupService.isShowPopup = false;

        }

    }
}