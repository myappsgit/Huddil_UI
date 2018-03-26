import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MeetupService } from '../../provider/meetup.service';
import { Router, RouterModule, NavigationExtras } from '@angular/router';

import { createChart } from '../../../assets/js/chartScript.js';

@Component({
  selector: 'advisor-dashboard',
  templateUrl: 'advisor-dashboard.component.html',
  styleUrls: ['advisor-dashboard.component.css']
})
export class AdvisorDashboardComponent {

  facilityNewRequestCount: any;
  facilityApprovedCount: any;
  facilityDeniedCount: any;
  facilityHuddilRequestVerifyCount: any;
  facilityStoppedOrBlockedCount: any;
  totalFacilityStatusCount: any;
  lastElementOfAdvisorFacilities: any;
  lastThreeFacility: any;
  facilityStatus: any;
  advisorfacilities: any;
  huddilVerifiedStatusCount: any;
  newRequestStatus: any;
  ApprovedStatus
  DeniedStatus: any;
  huddilRequestVerifyStatus: any;
  stoppedOrBlockedStatus: any;
  huddilVerifiedStatus: any;
  isLoadingData: boolean;


  errorMessage = '';
  errorMessageForPieChart = '';

  showLoader: boolean = true;
  showPirChart: boolean = false;
  facilityCountEmpty: boolean;
  isNoRecordFound: boolean;
  showFacilityData: boolean;
  isSessionExpired: boolean;

  advisorLatestFacilities = [];
  public pieChartData;
  //pie
  // public pieChartLabels: string[] = ['New Request', 'Approved', 'Denied', 'Blocked']
  // public pieChartData;
  // public doughnutChartType: string = 'doughnut';
  // public doughnutChartColors: any[] = [{ backgroundColor: ["#90caf9", "#a5d6a7", "#ef9a9a", "#9b9b9b"], borderColor: ["#90caf9", "#a5d6a7", "#ef9a9a", "#9b9b9b"] }];
  // public pieChartLegend: boolean = false;

  // public options = {
  //   labels: true,
  //   tooltips: {
  //     backgroundColor: '#000',
  //     bodyFontSize: 35
  //   }
  // };
  constructor(public meetupService: MeetupService, public router: Router) {


  }

  ngOnInit() {
    this.getfacilityStatus();
    this.getfacilityByAdvisor();
  }

  getfacilityStatus() {
    this.isLoadingData = true;
    this.meetupService.getFacilityStatusByAdvisor().subscribe(res => {
      this.isLoadingData = false;
      let statusData = JSON.parse(res.text());

      if (this.facilityNewRequestCount == 0 && this.facilityApprovedCount == 0 && this.facilityDeniedCount == 0 && this.facilityHuddilRequestVerifyCount == 0) {

        this.facilityCountEmpty = true;
        this.showPirChart = false;
      }

      else {
        let responseCode = res.headers.get('ResponseCode');
        switch (responseCode) {
          case ('2461'):
            this.facilityCountEmpty = false;
            this.showPirChart = true;

            this.facilityNewRequestCount = statusData[0].count;
            this.facilityApprovedCount = statusData[2].count;
            this.facilityDeniedCount = statusData[1].count;
            this.facilityHuddilRequestVerifyCount = statusData[4].count;
            this.facilityStoppedOrBlockedCount = statusData[3].count;
            this.huddilVerifiedStatusCount = statusData[5].count;

            this.newRequestStatus = statusData[0].status;
            this.ApprovedStatus = statusData[2].status;
            this.DeniedStatus = statusData[1].status;
            this.huddilRequestVerifyStatus = statusData[4].status;
            this.stoppedOrBlockedStatus = statusData[3].status;
            this.huddilVerifiedStatus = statusData[5].status;

            this.pieChartData = [this.facilityNewRequestCount, this.facilityApprovedCount, this.facilityDeniedCount, this.facilityStoppedOrBlockedCount]
            this.showPirChart = true;
            this.totalFacilityStatusCount = this.facilityNewRequestCount + this.facilityApprovedCount + this.facilityDeniedCount + this.facilityStoppedOrBlockedCount
            if (this.facilityNewRequestCount == 0 && this.facilityApprovedCount == 0 && this.facilityDeniedCount == 0 && this.facilityHuddilRequestVerifyCount == 0) {

              this.facilityCountEmpty = true;
              this.showPirChart = false;
            }
            else {
              this.isLoadingData = false;

              this.showChart();

            }


            break;
          case ('2462'):
            this.facilityCountEmpty = false;
            this.showPirChart = false;
            this.errorMessage = 'There is some technical problem. Please contact administrator.';
            break;
          case ('9999'):
            if (!this.meetupService.isInvalidSessionPopupDisplayed) {
              this.facilityCountEmpty = false;
              this.showPirChart = false;
              this.meetupService.isShowPopup = true;
              this.meetupService.isWarningPopup = true;
              this.meetupService.popupMessage = 'Your session has expired. Please login again.';
              this.isSessionExpired = true;
              this.meetupService.isInvalidSessionPopupDisplayed = true;
            }
            break;

          default:
            if (!this.meetupService.isInvalidSessionPopupDisplayed) {
              this.facilityCountEmpty = false;
              this.showPirChart = false;
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
        this.showLoader = false;
        if (error.status == 500) {
          this.showPirChart = true;
          this.isNoRecordFound = false;
          this.errorMessageForPieChart = 'Internal server error';

        } else {
          this.showPirChart = true;
          this.isNoRecordFound = false;
          this.errorMessageForPieChart = 'Something went wrong in server';
        }
      })
  }

  closePopup(type) {
    if (type == "1") {
      this.meetupService.isShowPopup = false;
      this.router.navigate(['']);
    }
    else if (type == "0") {
      this.meetupService.isShowPopup = false;

    }

  }
  showfacilityListBaseUponStatus(status) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        'status': status
      }
    };
    this.router.navigate(['/advisor/facility-listing'], navigationExtras);
  }
  getfacilityByAdvisor() {

    this.meetupService.getFacilitiesForAdvisorData(1, 3).subscribe(res => {
      this.showLoader = false;
      let result = JSON.parse(res.text());

      this.advisorfacilities = JSON.parse(res.text());

      if (this.advisorfacilities.length == 0) {
        this.isNoRecordFound = true;
        this.showFacilityData = false;
      }
      else if (this.advisorfacilities.length > 0) {
        let responseCode = res.headers.get('ResponseCode');
        switch (responseCode) {
          case ('2121'):
            this.isNoRecordFound = false;
            this.lastThreeFacility = this.advisorfacilities.slice(-3);
            this.showFacilityData = true;
            break;
          case ('2122'):
            this.showFacilityData = false;
            this.isNoRecordFound = false;
            this.errorMessage = 'There is some technical problem. Please contact administrator.';
            break;
          case ('9999'):
            if (!this.meetupService.isInvalidSessionPopupDisplayed) {
              this.showFacilityData = false;
              this.isNoRecordFound = false;
              this.meetupService.isShowPopup = true;
              this.meetupService.isWarningPopup = true;
              this.meetupService.popupMessage = 'Your session has expired. Please login again.';
              this.isSessionExpired = true;
              this.meetupService.isInvalidSessionPopupDisplayed = true;
            }
            break;
          default:
            if (!this.meetupService.isInvalidSessionPopupDisplayed) {
              this.showFacilityData = false;
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
        this.showLoader = false;
        if (error.status == 500) {
          this.showFacilityData = false;
          this.isNoRecordFound = false;
          this.errorMessage = 'Internal server error';

        } else {
          this.showFacilityData = false;
          this.isNoRecordFound = false;
          this.errorMessage = 'Something went wrong in server';
        }
      })
  }
  // events
  public chartClicked(e: any): void {

  }

  public chartHovered(e: any): void {

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


  }
}
