import { Component } from '@angular/core';
import { MeetupService } from '../../../provider/meetup.service';


import { Router, RouterModule, NavigationExtras } from '@angular/router';
import { createChart } from '../../../../assets/js/chartScript.js';

@Component({
  selector: 'facility-dashboard',
  templateUrl: 'facility-dashboard.component.html',
  styleUrls: ['facility-dashboard.component.css'],
})
export class FacilityDashboardComponent {

  //facility status

  approvedFacilitiesCount: number = 0;
  deniedFacilitiesCount: number = 0;
  pendingFacilitiesCount: number = 0;
  facilitiesTotalCount: number = 0;
  isLoadingData: boolean;
  isGraphDataReady: boolean;
  //pie
  public pieChartData;

  public facilityCountEmpty: boolean;
  errorMsz: string = '';
  isSessionExpired: boolean;
  blockedFacilitiesCount: number = 0;
  totalFacilityStatusCount;

  constructor(public meetupService: MeetupService, public router: Router) {

  }
  ngOnInit() {
    this.getCountOfFacilitiesStatus();
  }
  showfacilityListBaseUponStatus(status) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'status': status
      }
    };
    this.router.navigate(['/service-provider/facility-listing'], navigationExtras);
  }
  getCountOfFacilitiesStatus() {
    this.isGraphDataReady = false;
    let isOnline: boolean = navigator.onLine;
    if (isOnline == false) {
      this.errorMsz = 'You are offline. Please check your network';
    } else {
      this.errorMsz = '';
      this.isLoadingData = true;
      this.meetupService.getCountOfFacilitiesStatus().subscribe(response => {
        let result = JSON.parse(response.text());

        let responseCode = response.headers.get('ResponseCode');
        this.isLoadingData = false;
        switch (responseCode) {
          case '2461':

            this.deniedFacilitiesCount = result[8].count + result[9].count;
            this.approvedFacilitiesCount = result[0].count + result[1].count + result[13].count;
            this.pendingFacilitiesCount = result[5].count + result[6].count;
            this.blockedFacilitiesCount = result[2].count + result[3].count + result[4].count + result[10].count + result[11].count + result[12].count;




            this.facilitiesTotalCount = this.deniedFacilitiesCount + this.approvedFacilitiesCount + this.pendingFacilitiesCount + this.blockedFacilitiesCount;
            this.pieChartData = [this.deniedFacilitiesCount, this.approvedFacilitiesCount, this.pendingFacilitiesCount, this.blockedFacilitiesCount];

            if (this.deniedFacilitiesCount == 0 && this.approvedFacilitiesCount == 0 && this.pendingFacilitiesCount == 0) {
              this.facilityCountEmpty = true;
              this.isLoadingData = false;
            }
            else {
              this.isLoadingData = false;


              this.showChart();

            }
            break;
          case '2462':
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
        })
    }
  }

  showChart() {

    var element = document.getElementById("facilityDashboardGraph1");
    var type = 'doughnut';
    var labels = ['Denied Facilities', 'Approved Facilities', 'Pending Facilities', 'Blocked Facilities'];
    var data = [{
      data: this.pieChartData,
      backgroundColor: ["#ef9a9a", "#a5d6a7", "#90caf9", "#9b9b9b"],
      borderColor: ["#ef9a9a", "#a5d6a7", "#90caf9", "#9b9b9b"],
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


    createChart(element, type, labels, data, options);
    this.isGraphDataReady = true;

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