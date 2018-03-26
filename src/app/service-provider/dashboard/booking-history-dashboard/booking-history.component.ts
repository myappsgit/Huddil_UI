import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MeetupService } from '../../../provider/meetup.service';
import { Router } from '@angular/router';


@Component({
  selector: 'booking-history-dashboard',
  templateUrl: 'booking-history.component.html',
  styleUrls: ['booking-history.component.css'],
})
export class BookingHistoryDashboardComponent {
  isShowFilterBox: boolean;
  form: FormGroup;

  isLoadingData: boolean;
  listOfBookings: any = [];
  listOfLocalities;
  noRecordFound;
  errorMsz: string = '';
  isSessionExpired: boolean;
  constructor(public meetupService: MeetupService, fb: FormBuilder, public router: Router) {
    this.form = fb.group({
      selectCity: ['', Validators.required],
      selectLocality: ['', Validators.required],
      selectFacility: ['', Validators.required],
      status: ['', Validators.required]
    });
    this.searchBookingsByFilters();
  }
  showFilterBox() {
    this.isShowFilterBox = !this.isShowFilterBox;
  }
  searchBookingsByFilters() {
    this.errorMsz = '';
    let isOnline: boolean = navigator.onLine;
    if (isOnline == false) {
      this.errorMsz = 'You are offline. Please check your network';
    } else {
      this.isLoadingData = true;
      this.noRecordFound = false;
      let facilityTypeValue = this.form.controls['selectFacility'].value != '' ? this.form.controls['selectFacility'].value : 0;
      let cityValue = this.form.controls['selectCity'].value != '' ? this.form.controls['selectCity'].value : 0;
      let localityValue = this.form.controls['selectLocality'].value != '' ? this.form.controls['selectLocality'].value : 0;
      let bookingStatusValue = this.form.controls['status'].value != '' ? this.form.controls['status'].value : 0;

      this.isLoadingData = true;
      this.meetupService.getSPBookings(cityValue, localityValue, 0, bookingStatusValue, facilityTypeValue, 1, 10).subscribe(response => {
        this.isLoadingData = false;
        let result = JSON.parse(response.text());
        let responseCode = response.headers.get('ResponseCode');
        switch (responseCode) {
          case '2101':
            this.listOfBookings = result;

            if (this.listOfBookings.length == 0) {
              this.noRecordFound = true;
            }
            break;
          case '2102':
            this.errorMsz = 'There is some technical problem. Please contact administrator.';
            break;

          case ('9999'):

            // if (!this.meetupService.isInvalidSessionPopupDisplayed) {

            //   this.meetupService.isShowPopup = true;
            //   this.meetupService.isWarningPopup = true;
            //   this.meetupService.popupMessage = 'Your session has expired. Please login again.';
            //   this.isSessionExpired = true;
            //   this.meetupService.isInvalidSessionPopupDisplayed = true;
            // }
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


      },
        (error) => {
          this.isLoadingData = false;
          if (error.status == 500) {
            this.errorMsz = 'Internal server error';


          } else {
            this.errorMsz = 'Something went wrong in server.';

          }
        });
    }

  }
  displayStatus(statusId) {
    let status;
    switch (statusId) {
      case 1:
        status = 'Pending';
        break;
      case 2:
        status = 'Cancelled';
        break;
      case 3:
        status = 'Confirmed';
        break;
    }
    return status;
  }
  showBookingDetails(bookingId) {
    this.router.navigate(['service-provider/booking-history/booking-detail/' + bookingId]);
  }
  getlocalityDataBasedOnSelectedCity() {
    let cityId = this.form.controls['selectCity'].value;
    this.meetupService.getLocalities(cityId).subscribe(res => {
      this.listOfLocalities = res;
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
