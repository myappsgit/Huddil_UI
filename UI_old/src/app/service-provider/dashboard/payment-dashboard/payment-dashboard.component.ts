import { Component } from '@angular/core';
import { MeetupService } from '../../../provider/meetup.service';

import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'payment-dashboard',
  templateUrl: 'payment-dashboard.component.html',
  styleUrls: ['payment-dashboard.component.css'],
})
export class PaymentDashboardComponent {
  forReceived: boolean = true;
  forcancelled: boolean;
  forRefund: boolean;
  isReceivedGraphDataReady: boolean;
  isRefundGraphDataReady: boolean;
  form: FormGroup;
  //graph

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    tooltips: {
      backgroundColor: '#000',
      titleFontSize: 18,
      bodyFontSize: 18
    }
  };
  public chartColors: Array<any> = [
    {
      backgroundColor: '#6A97FF',
    }]
  public barReceivedChartLabels: string[] = [];
  public barChartRefundLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;

  public barChartReceivedData: any[];
  public barChartRefundData: any[];

  isReceivedDataEmpty: boolean;
  isRefundDataEmpty: boolean;
  errorMszReceive: string = '';
  errorMszRefund: string = '';
  isSessionExpired: boolean;
  selectedYear = "";
  selectedMonth = "";

  constructor(public meetupService: MeetupService, public fb: FormBuilder, public router: Router) {
    this.form = fb.group({
      month: ['', Validators.required],
      year: ['', Validators.required]
    });
    this.selectedYear = "" + (new Date()).getFullYear();
    this.selectedMonth = "" + ((new Date()).getMonth() + 1);
    this.getRevenue(this.selectedMonth, this.selectedYear);
  }
  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

  }

  receivedGraph() {

    this.forReceived = true;
    this.forRefund = false;
  }

  refundGraph() {

    this.forReceived = false;
    this.forRefund = true;
  }

  getRevenue(month, year) {
    let isOnline: boolean = navigator.onLine;
    if (isOnline == false) {
      this.errorMszReceive = 'You are offline. Please check your network';
      this.errorMszRefund = 'You are offline. Please check your network';
    } else {
      this.errorMszReceive = '';
      this.errorMszRefund = '';
      let approvedChartData = [];
      let refundChartData = [];
      this.barReceivedChartLabels = [];
      this.barChartRefundLabels = [];

      //get received revenue
      this.meetupService.getRevenue(month, 1, year).subscribe(response => {
        let result = JSON.parse(response.text());
        let responseCode = response.headers.get('ResponseCode');
        switch (responseCode) {
          case '2611':
            if (result.length > 0) {
              this.isReceivedDataEmpty = false;
              result.forEach(element => {

                this.barReceivedChartLabels.push(element.date);
                approvedChartData.push(element.sum);
              });

              this.barChartReceivedData = [{ data: approvedChartData }];
              this.isReceivedGraphDataReady = true;
            }
            else {
              this.isReceivedGraphDataReady = false;
              this.isReceivedDataEmpty = true;
            }
            break;

          case '2612':
            this.errorMszReceive = 'There is some technical problem. Please contact administrator.';
            break;
          case ('9999'):
            // if (!this.meetupService.isInvalidSessionPopupDisplayed) {

            //   this.meetupService.isShowPopup = true;
            //   this.meetupService.isWarningPopup = true;
            //   this.meetupService.popupMessage = '99Your session has expired. Please login again.';
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

          if (error.status == 500) {
            this.errorMszReceive = 'Internal server error';


          } else {
            this.errorMszReceive = 'Something went wrong in server.';

          }
        });

      //get refund revenue
      this.meetupService.getRevenue(month, 0, year).subscribe(response => {
        let result = JSON.parse(response.text());
        let responseCode = response.headers.get('ResponseCode');

        switch (responseCode) {
          case '2611':
            if (result.length > 0) {
              this.isRefundDataEmpty = false;
              result.forEach(element => {

                this.barChartRefundLabels.push(element.date);
                refundChartData.push(element.sum);
              });

              this.barChartRefundData = [{ data: refundChartData }];

              this.isRefundGraphDataReady = true;
            }
            else {
              this.isRefundGraphDataReady = false;
              this.isRefundDataEmpty = true;
            }
            break;
          case '2612':
            this.errorMszReceive = 'There is some technical problem. Please contact administrator.';
            break;
          case ('9999'):

            // if (!this.meetupService.isInvalidSessionPopupDisplayed) {

            //   this.meetupService.isShowPopup = true;
            //   this.meetupService.isWarningPopup = true;
            //   this.meetupService.popupMessage = '2Your session has expired. Please login again.';
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

          if (error.status == 500) {
            this.errorMszRefund = 'Internal server error';


          } else {
            this.errorMszRefund = 'Something went wrong in server.';

          }
        });

    }

  }
  filterGraphData() {
    let month = this.form.controls['month'].value;
    let year = this.form.controls['year'].value;
    this.getRevenue(month, year);
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