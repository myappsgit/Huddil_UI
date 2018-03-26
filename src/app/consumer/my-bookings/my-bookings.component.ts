import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { Router, RouterModule, NavigationExtras } from '@angular/router';

@Component({
  selector: 'my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {

  forUpcomingContainer: boolean = true;
  forHistoryContainer: boolean;
  forCancelContainer: boolean;

  upcomingBookingsArray: any = [];
  bookingHistoryArray: any = [];
  cancelledBookingsArray: any = [];

  //loading data variables

  isLoadingUpcomingData: boolean;
  isLoadingCancelledData: boolean;
  isLoadingHistoryData: boolean;

  //pagination -- upcoming
  totalPagesUpcoming;
  currentPageUpcoming: number = 1;
  noOfRecordsInOnePageUpcoming: number = 10;
  totalPaginationTabsUpcoming: number = 0;

  //pagination -- history
  totalPagesHistory;
  currentPageHistory: number = 1;
  noOfRecordsInOnePageHistory: number = 10;
  totalPaginationTabsHistory: number = 0;

  //pagination -- cancelled
  totalPagesCancelled;
  currentPageCancelled: number = 1;
  noOfRecordsInOnePageCancelled: number = 10;
  totalPaginationTabsCancelled: number = 0;

  errorMsz: string = '';
  isSessionExpired: boolean;


  constructor(public meetupService: MeetupService, private router: Router) {
    this.getUpcomingBookings(1);
  }

  showUpcomingContainerData() {
    this.forUpcomingContainer = true;
    this.forHistoryContainer = false;
    this.forCancelContainer = false;
  }
  showHistoryContainerData() {
    this.forHistoryContainer = true;
    this.forUpcomingContainer = false;
    this.forCancelContainer = false;
  }
  showCancelContainerData() {
    this.forCancelContainer = true;
    this.forUpcomingContainer = false;
    this.forHistoryContainer = false;
  }
  ngOnInit() {
    //forUpcomingBookings


    //forbookinghistorydetails
    this.getHistoryBookings(1);

    //forbookingcancellation
    this.getCancelledBookings(1);
  }

  getUpcomingBookings(page) {
    this.errorMsz = '';
    // if (page == 1) {
    //   this.totalPaginationTabsUpcoming = 0;
    // }
    this.currentPageUpcoming = page;
    this.isLoadingUpcomingData = true;
    this.meetupService.getUpcomingBookings(page, this.noOfRecordsInOnePageUpcoming).subscribe(response => {
      this.upcomingBookingsArray = JSON.parse(response.text());
      this.isLoadingUpcomingData = false;
      let responseCode = response.headers.get('ResponseCode');
      switch (responseCode) {
        case '2101':
          if (page == 1) {
            this.totalPagesUpcoming = response.headers.get('totalRecords');
            this.totalPaginationTabsUpcoming = Math.ceil(this.totalPagesUpcoming / this.noOfRecordsInOnePageUpcoming);
          }
          break;
        case '2102':
          this.errorMsz = 'There is some technical problem. Please contact administrator.';
          break;
        case '9996':
          this.errorMsz = 'User is not allowed to perform this action';
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
        this.isLoadingUpcomingData = false;
        if (error.status == 500) {
          this.errorMsz = 'Internal server error';


        } else {
          this.errorMsz = 'Something went wrong in server.';

        }
      });
  }
  getHistoryBookings(page) {
    this.errorMsz = '';
    // if (page == 1) {
    //   this.totalPaginationTabsHistory = 0;
    // }
    this.currentPageHistory = page;
    this.isLoadingHistoryData = true;
    this.meetupService.getBookingHistoryDetails(page, this.noOfRecordsInOnePageHistory).subscribe(response => {
      this.bookingHistoryArray = JSON.parse(response.text());
      this.isLoadingHistoryData = false;
      let responseCode = response.headers.get('ResponseCode');
      switch (responseCode) {
        case '2101':
          if (page == 1) {
            this.totalPagesHistory = response.headers.get('totalRecords');
            this.totalPaginationTabsHistory = Math.ceil(this.totalPagesHistory / this.noOfRecordsInOnePageHistory);
          }
          break;
        case '2102':
          this.errorMsz = 'There is some technical problem. Please contact administrator.';
          break;
        case '9996':
          this.errorMsz = 'User is not allowed to perform this action';
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
        this.isLoadingHistoryData = false;
        if (error.status == 500) {
          this.errorMsz = 'Internal server error';


        } else {
          this.errorMsz = 'Something went wrong in server.';

        }
      });
  }
  getCancelledBookings(page) {
    this.errorMsz = '';
    // if (page == 1) {
    //   this.totalPaginationTabsCancelled = 0;
    // }
    this.currentPageCancelled = page;

    this.isLoadingCancelledData = true;
    this.meetupService.getBookingCancellationDetails(page, this.noOfRecordsInOnePageCancelled).subscribe(response => {
      let responseCode = response.headers.get('ResponseCode');
      this.isLoadingCancelledData = false;
      switch (responseCode) {
        case '2101':
          this.cancelledBookingsArray = JSON.parse(response.text());
          if (page == 1) {
            this.totalPagesCancelled = response.headers.get('totalRecords');
            this.totalPaginationTabsCancelled = Math.ceil(this.totalPagesCancelled / this.noOfRecordsInOnePageCancelled);
          }
          break;
        case '2102':
          this.errorMsz = 'There is some technical problem. Please contact administrator.';
          break;
        case '9996':
          this.errorMsz = 'User is not allowed to perform this action';
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
        this.isLoadingCancelledData = false;
        if (error.status == 500) {
          this.errorMsz = 'Internal server error';


        } else {
          this.errorMsz = 'Something went wrong in server.';

        }
      });
  }

  getUpcomingBookingDetailId(bookingObj, status) {
    let navigationExtras: NavigationExtras = {
      queryParams: bookingObj
    };
    // let index = this.upcomingBookingsArray.findIndex(val => val.id == id)
    // this.meetupService.upcomingBookingDetails = this.upcomingBookingsArray[index];
    this.router.navigate(['/consumer/my-bookings/booking-detail/' + status], navigationExtras);
  }
  facilityByPaginationUpcoming(page) {
    this.getUpcomingBookings(page);
  }
  facilityByPaginationHistory(page) {
    this.getHistoryBookings(page);
  }
  facilityByPaginationCancelled(page) {
    this.getCancelledBookings(page);
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
