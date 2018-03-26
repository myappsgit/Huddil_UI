import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { MeetupService } from '../../provider/meetup.service';

@Component({
  selector: 'booking-history',
  templateUrl: 'booking-history.component.html',
  styleUrls: ['booking-history.component.css'],
})
export class BookingHistoryComponent {

  form: FormGroup;
  searchBookingIdForm: FormGroup;

  listOfCities: string;
  listOfFacilities: string;
  viewAllBookings: string;
  searchTitleForm: string;
  BookingList: string;
  errorMessage: string = '';

  bookingDetails: any;
  listOfLocalities: any;
  facilitiesList: any = [];

  isBookingDetails: boolean;
  isShowFilterBox: boolean;
  isNoBookingDetails: boolean;
  isNoRecordFound: boolean;
  isSessionExpired: boolean;
  showLoader: boolean;

  //pagination
  totalPages;
  currentPage: number = 1;
  noOfRecordsInOnePage: number = 10;
  totalPaginationTabs: number = 0;
  ifCancelledBookings: boolean;


  statusOptions = [
    { id: "0", name: "All" },
    { id: "1", name: "Pending" },
    { id: "2", name: "Cancelled" },
    { id: "3", name: "Confirmed" },
    { id: "4", name: "Denied" },
    { id: "5", name: "Completed" }
  ];

  public huddilDropdownOptionsForFacilityType: any = {
    defaultOption: 'Select Facility Type',
    icon: '<i class="material-icons iconContainer" style ="font-size:18px;">supervisor_account</i>',
    width: '230px',
    height: '42px'
  }
  public huddilDropdownOptionsForCity: any = {
    defaultOption: 'Select City',
    icon: '<i class="fa fa-map-marker iconContainer" aria-hidden="true" style ="font-size:18px;"></i>',
    width: '230px',
    height: '42px'
  }
  public huddilDropdownOptionsForLocality: any = {
    defaultOption: 'Select Locality',
    icon: '<i class="fa fa-map-marker iconContainer" aria-hidden="true" style ="font-size:18px;"></i>',
    width: '230px',
    height: '42px'
  }

  public huddilDropdownOptionsForStatusOptions: any = {
    defaultOption: 'Select Status',
    icon: '<i class="material-icons" style ="font-size:18px;">description</i>',
    width: '230px',
    height: '42px'
  }

  constructor(public meetupService: MeetupService, fb: FormBuilder, public router: Router) {
    this.form = fb.group({
      selectCity: ['0', Validators.required],
      selectLocality: ['0', Validators.required],
      selectFacility: ['0', Validators.required],
      status: ['', Validators.required],
      month: ['', Validators.required]
    });

    this.searchBookingIdForm = fb.group({
      searchTitle: ['', Validators.required],
    });
    this.searchFacilitiesByFilters(1);
    this.getlocalityDataBasedOnSelectedCity();
  }

  showExtraFilterBox() {
    this.isShowFilterBox = !this.isShowFilterBox;

  }
  hideExtraFilterBox() {
    this.isShowFilterBox = false;
  }
  // showBookingDetails(bookingId) {
  //   this.router.navigate(['service-provider/booking-history/booking-detail/' + bookingId]);
  // }

  showBookingDetails(bookingId, status) {
    //console.log(bookingId);
    this.router.navigate(['advisor/booking-history/facility-booking/' + bookingId + '/' + status]);

  }
  getlocalityDataBasedOnSelectedCity() {
    this.form.controls['selectCity'].valueChanges.subscribe(value => {
      if (value != undefined) {
        let cityId = this.form.controls['selectCity'].value;
        this.meetupService.getLocalities(cityId).subscribe(res => {
          this.listOfLocalities = res;

        },
          (error) => {
            if (error.status == 500) {
              this.isBookingDetails = false;
              this.isNoRecordFound = false;
              this.errorMessage = 'Internal server error';

            } else {
              this.isBookingDetails = false;
              this.isNoRecordFound = false;
              this.errorMessage = 'Something went wrong in server';
            }
          });
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
  searchFacilitiesByFilters(page) {
    this.ifCancelledBookings = false;
    this.showLoader = true;
    this.isNoRecordFound = false;
    this.isBookingDetails = false;
    let isOnline: boolean = navigator.onLine;
    this.currentPage = page;

    if (isOnline == false) {
      this.showLoader = false;
      this.errorMessage = 'You are offline. Please check your network';
    } else {

      let seachValue = this.searchBookingIdForm.controls['searchTitle'].value;

      if (seachValue != '') {
        this.meetupService.getBookingDetailsForAdvisor(seachValue, page, this.noOfRecordsInOnePage).subscribe(res => {
          this.showLoader = false;

          this.facilitiesList = JSON.parse(res.text());


          if (this.facilitiesList.length == 0) {

            this.totalPaginationTabs = 0;
            this.isNoRecordFound = true;
            this.isBookingDetails = false;
          }
          else {
            if (page == 1) {
              this.totalPages = res.headers.get('totalRecords');

              //let checkIfPaginationNotRequired = this.totalPages / this.noOfRecordsInOnePage;


              this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);

            }
            this.isBookingDetails = true;
            this.isNoRecordFound = false;
          }


        })
      }
      else {
        let searchTitle = this.searchBookingIdForm.controls['searchTitle'].value != '' ? this.searchBookingIdForm.controls['searchTitle'].value : null;
        let city = this.form.controls['selectCity'].value ? this.form.controls['selectCity'].value : 0;
        let locality = this.form.controls['selectLocality'].value ? this.form.controls['selectLocality'].value : 0;
        let facility = this.form.controls['selectFacility'].value ? this.form.controls['selectFacility'].value : 0;
        let status = this.form.controls['status'].value ? this.form.controls['status'].value : 0;
        let month = 0;
        this.ifCancelledBookings = false;
        if (status == '2') {
          this.ifCancelledBookings = true;
        }
        this.meetupService.getAdvisorBookings(city, locality, month, status, facility, page, this.noOfRecordsInOnePage).subscribe(response => {
          this.showLoader = false;
          this.facilitiesList = JSON.parse(response.text());
          if (this.facilitiesList.length == 0) {
            this.totalPaginationTabs = 0;
            this.isNoRecordFound = true;
            this.isBookingDetails = false;
          }
          else if (this.facilitiesList.length > 0) {

            if (page == 1) {
              this.totalPages = response.headers.get('totalRecords');

              this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);

            }
            let responseCode = response.headers.get('ResponseCode');
            switch (responseCode) {
              case ('2101'):
                this.showLoader = false;
                this.isBookingDetails = true;
                this.isNoRecordFound = false;
                break;
              case ('2342'):
                this.showLoader = false;
                this.isBookingDetails = false;
                this.isNoRecordFound = false;
                this.errorMessage = 'There is some technical problem. Please contact administrator.';
                break;
              case ('9999'):
                this.showLoader = false;
                if (!this.meetupService.isInvalidSessionPopupDisplayed) {
                  this.isBookingDetails = false;
                  this.isNoRecordFound = false;
                  this.meetupService.isShowPopup = true;
                  this.meetupService.isWarningPopup = true;
                  this.meetupService.popupMessage = 'your session has expired. Please login again.';
                  this.isSessionExpired = true;
                  this.meetupService.isInvalidSessionPopupDisplayed = true;
                }
                break;

              default:
                this.showLoader = false;
                if (!this.meetupService.isInvalidSessionPopupDisplayed) {
                  this.isBookingDetails = false;
                  this.isNoRecordFound = false;
                  this.meetupService.isShowPopup = true;
                  this.meetupService.isWarningPopup = true;
                  this.meetupService.popupMessage = 'Unknown error code' + responseCode;
                  this.isSessionExpired = false;
                }
                break;
            }

          }

        },
          (error) => {
            if (error.status == 500) {
              this.errorMessage = 'Internal server error';

            } else {
              this.errorMessage = 'Something went wrong in server';
            }
          });
      }
    }

  }
  displayStatus(status) {
    switch (status) {
      case 0:
        status = 'In Progress';
        break;
      case 1:
        status = 'Pending';
        break;
      case 2:
        status = 'Cancelled';
        break;
      case 3:
        status = 'Confirmed';
        break;
      case 4:
        status = 'Denied';
        break;
      case 5:
        status = 'Completed';
        break;
    }
    return status;
  }
  facilityByPagination(page) {
    this.searchFacilitiesByFilters(page);
  }
}