import { Component } from '@angular/core';
import { MeetupService } from '../../../provider/meetup.service';

import { createChart2 } from '../../../../assets/js/chartScript.js';

import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'booking-dashboard',
  templateUrl: 'booking-dashboard.component.html',
  styleUrls: ['booking-dashboard.component.css'],
})
export class BookingDashboardComponent {

  //facility status

  confirmedBookingCount: number = 0;
  cancelledBookingCount: number = 0;
  pendingBookingCount: number = 0;
  bookingTotalCount: number = 0;
  isLoadingData: boolean;
  isGraphDataReady: boolean;
  pieChartData;
  noCountForBookings: boolean;
  errorMsz: string = '';
  isSessionExpired: boolean;
  deniedBookingCount: number = 0;
  constructor(public meetupService: MeetupService, public router: Router) {
    this.getCountOfBookingStatus();
  }

  getCountOfBookingStatus() {
    this.errorMsz = '';
    let isOnline: boolean = navigator.onLine;
    if (isOnline == false) {
      this.errorMsz = 'You are offline. Please check your network';
    } else {
      this.isLoadingData = true;
      this.meetupService.getBookingsCountbySP().subscribe(response => {

        let result = JSON.parse(response.text());
        let responseCode = response.headers.get('ResponseCode');
        switch (responseCode) {
          case '2621':
            this.noCountForBookings = false;
            this.cancelledBookingCount = result[1].count;
            this.confirmedBookingCount = result[2].count;
            this.pendingBookingCount = result[0].count;
            this.deniedBookingCount = result[3].count;

            this.bookingTotalCount = this.cancelledBookingCount + this.confirmedBookingCount + this.pendingBookingCount + this.deniedBookingCount;
            this.pieChartData = [this.confirmedBookingCount, this.pendingBookingCount, this.cancelledBookingCount, this.deniedBookingCount];
            this.isGraphDataReady = true;
            this.isLoadingData = false;

            if (this.bookingTotalCount > 0) {
              this.noCountForBookings = false;
              this.isGraphDataReady = true;
              this.showChart();
            }
            else {
              this.noCountForBookings = true;
              this.isGraphDataReady = false;
            }
            break;
          case '2622':
            this.errorMsz = 'There is some technical problem. Please contact administrator.';
            break;
          case '9996':
            this.errorMsz = 'Invalid user type';
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
        })
    }
  }

  showChart() {
    var element = document.getElementById("myChart");
    var type = 'doughnut';
    var labels = ['Confirmed', 'Pending', 'Cancelled', 'Denied'];
    var data = [{
      data: this.pieChartData,
      backgroundColor: ["#a5d6a7", "#90caf9", "#9b9b9b", "#ef9a9a"],
      borderColor: ["#a5d6a7", "#90caf9", "#9b9b9b", "#ef9a9a"],
      borderWidth: 1
    }];
    var options = {

      labels: true,
      legend: false,
      tooltips: {
        backgroundColor: '#000',
        bodyFontSize: 18
      }
    };

    createChart2(element, type, labels, data, options);
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
  showBookingHistoryPage(status) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'status': status
      }
    };
    this.router.navigate(['/service-provider/booking-history'], navigationExtras);
  }
}