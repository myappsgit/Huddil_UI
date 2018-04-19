import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { createConsumerMap, getNearBy } from '../../../../assets/js/customMap.js';
//assets/js/customMap.js
import { AdminService } from '../../admin-providers/admin.services';
import { initMapJS } from '../../../../assets/js/customMap.js';
declare var jQuery: any;


@Component({
  selector: 'facility-details',
  templateUrl: 'facility-details.component.html',
  styleUrls: ['facility-details.component.css']
})

export class FacilityDetailsComponent {

  facility: any;
  forOverviewDesc: boolean = true;
  forReviewDesc: boolean;
  forDeactive: boolean = true;
  forUpdate: boolean;
  facilityId: any;
  facilityDetails: any = {};
  listOfReviews: any = {};
  dataReady: boolean;
  facilityTermsAndConditions: any;
  termsAndConditionDescription: any;
  // amenities:any;
  isMapReady: boolean;
  approvalPending: boolean;
  days = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  statusBtnText: string;
  buttonTitleText = "";
  isTheStatusBlocked: boolean = false;
  isShowTermsAndConditions: boolean;
  facilityLocationNameData: any;

  constructor(public adminService: AdminService, public route: ActivatedRoute) { }

  ngOnInit() {
    initMapJS();
    this.facilityId = this.route.snapshot.paramMap.get('id');


    this.getFacilityDetails();

  }

  //To display Map
  // ngAfterViewChecked() {
  //   if (this.facilityDetails != null && !this.isMapReady) {
  //     createConsumerMap(this.facilityDetails.latitude, this.facilityDetails.longtitude, this.facilityDetails.title, this.facilityDetails.location.address);
  //     getNearBy(this.facilityDetails.latitude, this.facilityDetails.longtitude, 'hotels');
  //     this.isMapReady = true;
  //   }
  // }

  getFacilityDetails() {

    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      alert("You are offline. Please check your network.");
    } else {
      this.adminService.isLoading = true;
      this.adminService.getFacilityDetails(this.facilityId).subscribe(response => {
        this.adminService.isLoading = false;

        let responseCode = response.headers.get('ResponseCode');
        //alert(responseCode);

        if (responseCode == '2121') {

          this.facilityDetails = JSON.parse(response.text());
          this.dataReady = true;
          this.facilityTermsAndConditions = this.facilityDetails.location.facilityTermsConditionses.forEach(element => {
            this.termsAndConditionDescription = element.description;
          });
          this.facilityLocationNameData = this.facilityDetails.location;

          //block/unblock button status
          if (this.facilityDetails.status == 5 || this.facilityDetails.status == 7 || this.facilityDetails.status == 8) {
            this.statusBtnText = "Block";
            this.buttonTitleText = "Click the button to block the facility.";
            this.isTheStatusBlocked = false;
          }
          else if (this.facilityDetails.status == 11 || this.facilityDetails.status == 12 || this.facilityDetails.status == 13 || this.facilityDetails.status == 14) {
            this.statusBtnText = "Activate";
            this.buttonTitleText = "Click the button to activate the facility.";
            this.isTheStatusBlocked = true;
          }
          else {
            this.approvalPending = true;
          }
        }
        else if (responseCode == '2122') {
          this.adminService.popupMessage = "Facility read failure";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        } else if (responseCode == '9999') {
          this.adminService.popupMessage = "Your session has expired. Please login again.";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        }
      }, (error) => {
        this.adminService.isLoading = false;
        if (error.status == 500) {
          this.adminService.popupMessage = "Internal server error";
          this.adminService.isShowPopup = true;
          this.adminService.isWarningPopup = true;
        } else if (error.status == 400) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Bad request";
        } else if (error.status == 401) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Unauthorized";
        } else if (error.status == 403) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Forbidden";
        } else if (error.status == 404) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Not Found";
        } else {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = 'Something went wrong in server.';
        }
      });
    }
  }


  showOverview() {
    this.forOverviewDesc = true;
    this.forReviewDesc = false;
    this.isShowTermsAndConditions = false;
    //loading Map On onclick overView Button
    //createConsumerMap(this.facilityDetails.latitude, this.facilityDetails.longtitude, this.facilityDetails.title, this.facilityDetails.location.address);
  }

  showTermsAndConditions() {
    this.forOverviewDesc = false;
    this.forReviewDesc = false;
    this.isShowTermsAndConditions = true;
  }

  showReviews() {
    this.forReviewDesc = true;
    this.forOverviewDesc = false;
    this.isShowTermsAndConditions = false;

    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      alert("You are offline. Please check your network.");
    } else {
      this.adminService.isLoading = true;
      this.adminService.getReviews(this.facilityId).subscribe(response => {
        this.adminService.isLoading = false;


        let responsecode = response.headers.get('ResponseCode');
        if (responsecode == '2261') {
          this.listOfReviews = JSON.parse(response.text());

        }
        else if (responsecode == '2262') {
          this.adminService.popupMessage = "Review read failure";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        }
      }, (error) => {
        this.adminService.isLoading = false;
        if (error.status == 500) {
          this.adminService.popupMessage = "Internal server error";
          this.adminService.isShowPopup = true;
          this.adminService.isWarningPopup = true;
        } else if (error.status == 400) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Bad request";
        } else if (error.status == 401) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Unauthorized";
        } else if (error.status == 403) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Forbidden";
        } else if (error.status == 404) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Not Found";
        } else {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = 'Something went wrong in server.';
        }
      });
    }
  }

  //nearBy Map
  changeNearbyOption() {
    let type = jQuery('#details_nearby_select').val();
    getNearBy(this.facilityDetails.latitude, this.facilityDetails.longtitude, type);
  }

  //TO DO Block Unblock a facility

  blockUnblock() {

    if (this.isTheStatusBlocked == true) {
      this.activateOrBlockFacility(1, "Activated by the admin.");
    } else {
      this.activateOrBlockFacility(0, "Blocked by the admin.");
    }
  }

  activateOrBlockFacility(blockFacility, comments) {
    // alert('blockFacility-->' + blockFacility);

    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      alert("You are offline. Please check your network.");
    } else {
      this.adminService.isLoading = true;

      this.adminService.updateFacilityStatusByAdvisor(this.facilityId, blockFacility, comments).subscribe(response => {


        this.adminService.isLoading = false;
        let responsecode = response.headers.get('responsecode');

        if (responsecode == "2341") {

          if (!blockFacility) {
            this.adminService.popupMessage = "Facility has been blocked successfully.";
          }
          else {
            this.adminService.popupMessage = "Facility has been activated successfully.";
          }
          this.adminService.isSuccessPopup = true;
          this.adminService.isShowPopup = true;
          this.getFacilityDetails();
        } else if (responsecode == "2342") {
          this.adminService.popupMessage = "Facility activation/deactivation failure.";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        } else if (responsecode == "9998") {
          this.adminService.popupMessage = "User is not allowed to perform this action.";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        } else if (responsecode == "9999") {
          this.adminService.isInvalisSessionPopup = true;
          this.adminService.popupMessage = "Your session has expired. Please login again.";
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
        }

      }, (error) => {
        this.adminService.isLoading = false;
        if (error.status == 500) {
          this.adminService.popupMessage = "Internal server error";
          this.adminService.isShowPopup = true;
          this.adminService.isWarningPopup = true;
        } else if (error.status == 400) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Bad request";
        } else if (error.status == 401) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Unauthorized";
        } else if (error.status == 403) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Forbidden";
        } else if (error.status == 404) {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = "Not Found";
        } else {
          this.adminService.isWarningPopup = true;
          this.adminService.isShowPopup = true;
          this.adminService.popupMessage = 'Something went wrong in server.';
        }
      });
    }

  }

}
