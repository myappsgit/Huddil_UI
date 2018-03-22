import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'booking-history',
  templateUrl: 'booking-history.component.html',
  styleUrls: ['booking-history.component.css'],
})
export class BookingHistoryComponent {

  isShowFilterBox;
  form: FormGroup;
  searchBookingIdForm: FormGroup;
  listOfCities;
  listOfFacilities;
  listOfBookings: any = [];
  isLoadingData: boolean;
  listOfLocalities;
  noRecordFound: boolean;

  //pagination
  totalPages;
  currentPage: number = 1;
  noOfRecordsInOnePage: number = 10;
  totalPaginationTabs: number = 0;

  isSessionExpired: boolean;
  errorMsz: string = '';
  ifCancelledBookings: boolean;
  selectedValue: number;

  statusOptions = [
    { id: "0", name: "All" },
    { id: "1", name: "Pending" },
    { id: "2", name: "Cancelled" },
    { id: "3", name: "Confirmed" },
    { id: "4", name: "Denied" },
    { id: "5", name: "Completed" }
  ];
  allMonths = [
    { id: "0", name: "All" },
    { id: "1", name: "January" },
    { id: "2", name: "February" },
    { id: "3", name: "March" },
    { id: "4", name: "April" },
    { id: "5", name: "May" },
    { id: "6", name: "June" },
    { id: "7", name: "July" },
    { id: "8", name: "August" },
    { id: "9", name: "September" },
    { id: "10", name: "October" },
    { id: "11", name: "November" },
    { id: "12", name: "December" }
  ];

  public huddilDropdownOptionsForMonths: any = {
    defaultOption: 'Select Month',
    icon: '<i class="fa fa-calendar" style ="font-size:18px;"></i>',
    width: '172px',
    height: '38px',
    selectedValue: 0
  }
  public huddilDropdownOptionsForFacilityType: any = {
    defaultOption: 'Select Facility Type',
    icon: '<i class="material-icons" style ="font-size:18px;">supervisor_account</i>',
    width: '215px',
    height: '38px'
  }
  public huddilDropdownOptionsForCity: any = {
    defaultOption: 'Select City',
    icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
    width: '170px',
    height: '38px'
  }
  public huddilDropdownOptionsForLocality: any = {
    defaultOption: 'Select Locality',
    icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
    width: '185px',
    height: '38px'
  }
  // public huddilDropdownOptionsForMonth: any = {
  //   defaultOption: 'Select Month',
  //   icon: '<i class="fa fa-calendar" aria-hidden="true"></i>',
  //   width: '173px',
  //   height: '38px'
  // }
  public huddilDropdownOptionsForStatusOptions: any = {

  }

  constructor(public meetupService: MeetupService, fb: FormBuilder, public router: Router, public activatedRoute: ActivatedRoute) {
    this.form = fb.group({
      selectCity: ['0', Validators.required],
      selectLocality: ['0', Validators.required],
      selectFacility: ['0', Validators.required],
      booking_status: ['', Validators.required],
      month: ['', Validators.required]
    });

    this.searchBookingIdForm = fb.group({
      searchBookingId: ['', Validators.required]
    });
    this.getlocalityDataBasedOnSelectedCity();

    //this.searchBookingsByFilters(this.currentPage);
  }
  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params != null && params != undefined) {
        this.selectedValue = params['status'];
        //this.form.controls['booking_status'].setValue(params['status']);
        //this.form.controls['booking_status'].valueChanges;
      }
      this.huddilDropdownOptionsForStatusOptions = {
        defaultOption: 'Select Status',
        icon: '<i class="material-icons" style ="font-size:18px;">description</i>',
        width: '210px',
        height: '38px',
        selectedValue: this.selectedValue
      }

      this.searchBookingsByFilters(1);
    });

  }
  showExtraFilterBox() {
    if (this.isShowFilterBox == true) {
      this.isShowFilterBox = false;
    }
    else {
      this.isShowFilterBox = true;
    }
  }
  hideExtraFilterBox() {
    this.isShowFilterBox = false;
  }
  showBookingDetails(bookingId, status) {
    //console.log(bookingId);
    this.router.navigate(['service-provider/booking-history/facility-booking/' + bookingId + '/' + status]);

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
      case 4:
        status = 'Denied';
        break;
      case 0:
        status = 'In Progess';
        break;
      case 5:
        status = 'Completed';
        break;
    }
    return status;
  }

  searchBookingsByFilters(page) {
    this.ifCancelledBookings = false;
    this.errorMsz = '';
    let isOnline: boolean = navigator.onLine;
    if (isOnline == false) {
      this.isLoadingData = false;
      this.errorMsz = 'You are offline. Please check your network';
    } else {

      // if (page == 1) {
      //   this.totalPaginationTabs = 0;
      // }
      this.isLoadingData = true;
      this.noRecordFound = false;
      this.listOfBookings = [];
      this.currentPage = page;
      let bookingIdFieldValue = this.searchBookingIdForm.controls['searchBookingId'].value;
      if (bookingIdFieldValue != '') {
        this.meetupService.getBookingById(bookingIdFieldValue).subscribe(response => {
          this.isLoadingData = false;
          this.totalPaginationTabs = 0;
          let responseCode = response.headers.get('ResponseCode');

          switch (responseCode) {
            case '2101':
              if (response.text() == '') {
                this.totalPaginationTabs = 0;
                this.noRecordFound = true;
              }
              else {

                this.listOfBookings.push(JSON.parse(response.text()));
                // console.log(this.listOfBookings);
                let result = this.listOfBookings[0];
                if (result.length == 0) {
                  this.noRecordFound = true;
                  this.totalPaginationTabs = 0;
                }
                else {
                  this.listOfBookings = this.listOfBookings[0];
                }

              }

              this.isLoadingData = false;
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


        },
          (error) => {
            this.isLoadingData = false;
            if (error.status == 500) {
              this.errorMsz = 'Internal server error';


            } else {
              this.errorMsz = 'Something went wrong in server.';

            }
          }
        );
      }
      else {
        let bookingStatusValue;
        let facilityTypeValue = this.form.controls['selectFacility'].value != undefined ? this.form.controls['selectFacility'].value : 0;
        let cityValue = this.form.controls['selectCity'].value != undefined ? this.form.controls['selectCity'].value : 0;
        let localityValue = this.form.controls['selectLocality'].value != undefined ? this.form.controls['selectLocality'].value : 0;
        let monthValue = this.form.controls['month'].value != '' ? this.form.controls['month'].value : 0;
        //alert(monthValue);
        if ((this.selectedValue > 0 && this.form.controls['booking_status'].value == '') || (this.form.controls['booking_status'].value == undefined)) {

          bookingStatusValue = this.selectedValue;
        }
        else {
          this.selectedValue = 0;
          bookingStatusValue = this.form.controls['booking_status'].value ? this.form.controls['booking_status'].value : 0;
        }
        // alert(bookingStatusValue);
        this.ifCancelledBookings = false;
        if (bookingStatusValue == '2') {
          this.ifCancelledBookings = true;
        }
        if (bookingStatusValue == undefined) {
          bookingStatusValue = 0;
        }
        this.meetupService.getSPBookings(cityValue, localityValue, monthValue, bookingStatusValue, facilityTypeValue, page, this.noOfRecordsInOnePage).subscribe(response => {
          let responseCode = response.headers.get('ResponseCode');
          if (bookingStatusValue == '2') {

            this.ifCancelledBookings = true;
          }
          this.isLoadingData = false;
          switch (responseCode) {
            case '2101':
              if (JSON.parse(response.text()).length == 0) {
                this.totalPaginationTabs = 0;
                this.noRecordFound = true;
              }
              else {
                if (page == 1) {
                  this.totalPages = response.headers.get('totalRecords');
                  let checkIfPaginationNotRequired = this.totalPages / this.noOfRecordsInOnePage;
                  //alert('required'+checkIfPaginationNotRequired);
                  if (checkIfPaginationNotRequired <= 1) {

                    this.totalPaginationTabs = 0;
                  }
                  else {
                    this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);
                  }

                }
                this.listOfBookings = JSON.parse(response.text());
                //console.log(this.listOfBookings);
              }

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
  }



  getlocalityDataBasedOnSelectedCity() {
    this.form.controls['selectCity'].valueChanges.subscribe(value => {
      if (value != undefined) {
        let cityId = this.form.controls['selectCity'].value;

        this.meetupService.getLocalities(cityId).subscribe(res => {
          this.listOfLocalities = res;
        });
      }
    });


  }


  facilityByPagination(page) {
    this.searchBookingsByFilters(page);
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
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