import { Component } from '@angular/core';

import { Router, NavigationExtras } from '@angular/router';
import { MeetupService } from '../../provider/meetup.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'booking-summary',
  templateUrl: 'booking-summary.component.html',
  styleUrls: ['booking-summary.component.css']
})
export class BookingSummaryComponent {

  bookingDetails: any;
  costDetails: any;
  bookingTiming: any;
  form: FormGroup;
  bookingErrorMessage: string = '';
  bookingProcessStart: boolean;
  isHideReplan: boolean;
  bookingId;
  paymentProcessingStart: boolean;
  seats: any;

  constructor(public router: Router, public meetupService: MeetupService, fb: FormBuilder) {
    this.form = fb.group({
      method: ['', Validators.required]

    });
    this.bookingDetails = JSON.parse(sessionStorage.getItem('bookingDetails'));
    this.costDetails = JSON.parse(sessionStorage.getItem('costDetails'));
    this.bookingTiming = JSON.parse(sessionStorage.getItem('bookingTiming'));
    this.seats = sessionStorage.getItem('seats');
    console.log(this.bookingDetails);
    if (this.bookingDetails.paymnetType == '2') {
      this.form.controls['method'].setValue('offline');
    }
    else {
      this.form.controls['method'].setValue('online');
    }
  }


  goBack() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "previousPage": "booking-summary"
      }
    };
    this.router.navigate(['/consumer/facility-detail/' + this.bookingDetails.id], navigationExtras);
  }
  createBooking() {
    // if (this.form.controls['method'].value == 'online') {
    //   alert('Online Booking integration going on.....');
    // }
    // else {
    this.bookingProcessStart = true;
    let fromTime = this.bookingTiming[0].startTime;
    let toTime = this.bookingTiming[0].endTime;
    let capacity = this.seats;
    let facilityId = this.bookingDetails.id;
    let paymentMethod = this.form.controls['method'].value;
    let redirectUrl = this.meetupService.baseUrl + 'consumer/booking-process';

    this.meetupService.createBooking(fromTime, toTime, capacity, facilityId, paymentMethod, redirectUrl).subscribe(response => {

      this.bookingProcessStart = false;

      switch (response.responseCode) {
        case '3000':
          this.bookingErrorMessage = 'From time is after to time';
          break;
        case '3003':
          this.bookingErrorMessage = 'Invalid facility id';
          break;
        case '3004':
          this.bookingErrorMessage = 'Facility not available for booking';
          break;
        case '3005':
          this.bookingErrorMessage = 'Facility is under maintenance';
          break;
        case '3006':
          this.bookingErrorMessage = 'Booking start time is before facility opening time';
          break;
        case '3007':
          this.bookingErrorMessage = 'Booking end time is after facility closing time';
          break;
        case '3008':
          this.bookingErrorMessage = 'Facility does not have enough seats';
          break;
        case '3020':
          this.bookingErrorMessage = 'Seats should be non zero';
          break;
        case '3009':
          //this.bookingErrorMessage = 'Facility have enough seats'; for coworking
          this.bookingErrorMessage = 'Booking is confirmed';
          this.isHideReplan = false;
          this.bookingId = response.bookingId;

          this.router.navigate(['consumer/order-confirmation/' + this.bookingId]);

          break;
        case '3010':
          this.bookingErrorMessage = 'Already booking exist for the time specified';
          break;
        case '3014':
          this.bookingErrorMessage = 'Booking is confirmed';
          this.isHideReplan = false;
          this.bookingId = response.bookingId;
          this.router.navigate(['consumer/order-confirmation/' + this.bookingId]);
          break;
        case '3016':
          this.bookingErrorMessage = 'Please do not refresh or click the back button. You are being redirected to the payment gateway page';
          this.isHideReplan = false;
          if (paymentMethod == 'online') {
            if (response.paymentUrl != null) {
              this.paymentProcessingStart = true;
              sessionStorage.setItem('bookingId', response.bookingId);
              window.open(response.paymentUrl, "_self");
            }
            else {
              this.bookingErrorMessage = 'Technical error. Please contact administrator.';
            }

          }
          break;
        case '9996':
          this.bookingErrorMessage = 'User is not allowed to perform this action';
          break;
        case '3018':
          this.bookingErrorMessage = 'Facility is closed.';
          break;
        case '9999':
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Session invalid/ does not exist';

          break;


      }
    });
    //}
  }
  closePopup() {
    this.meetupService.forceLogoutWithoutSessionId();
    this.meetupService.isShowPopup = false;
    this.router.navigate(['']);
  }

}
