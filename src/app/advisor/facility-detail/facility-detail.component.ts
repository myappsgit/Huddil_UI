import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MeetupService } from '../../provider/meetup.service';
import { initMapJS } from '../../../assets/js/customMap.js';

@Component({
  selector: 'facility-detail',
  templateUrl: 'facility-detail.component.html',
  styleUrls: ['facility-detail.component.css']


})
export class FacilityDetailsComponent {

  advisorCommentBoxForm: FormGroup;

  facilityDetailsData: any;
  facilityTiming: any = [];
  facilityAmenitie: any;
  facilityId: any;
  facilityamenity: any;
  amenitiesList: any = [];


  dataReady: boolean;
  forOverviewDesc: boolean = true;
  forwhatsAroundDesc: boolean;
  forPoliciesDesc: boolean;
  isDeniedSection: boolean;
  showtextPendingForApproval: boolean;
  showVerifyButton: boolean;
  isSessionExpired: boolean;
  listOfLocations: any = [];
  popupMessage: string = '';
  facilityTermsAndConditions: any;
  termsAndConditionDescription: any;

  statusValue: number;
  forReview: boolean;
  isShowTermsAndConditions: boolean;
  listOfReviews = [];
  facilityLocationNameData: any;

  days = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  facilityStatus: string;

  constructor(public meetupService: MeetupService, public domSanitizer: DomSanitizer, public route: ActivatedRoute, public fb: FormBuilder, public router: Router) {

  }

  ngOnInit() {
    initMapJS();
    this.advisorCommentBoxForm = this.fb.group({
      textAreaForComment: ['', Validators.required]
    })

    this.facilityId = this.route.snapshot.paramMap.get('id');

    this.getFacility();
  }
  getFacility() {
    this.amenitiesList = [];
    this.isDeniedSection = false;
    this.meetupService.getfacilityByIdForAdvisor(this.facilityId).subscribe(response => {
      this.facilityDetailsData = JSON.parse(response.text());
      this.facilityTiming = this.facilityDetailsData.facilityTimings;
      this.facilityTermsAndConditions = this.facilityDetailsData.location.facilityTermsConditionses.forEach(element => {
        this.termsAndConditionDescription = element.description;
      });
      this.facilityamenity = this.facilityDetailsData.facilityAmenities;
      this.facilityLocationNameData = this.facilityDetailsData.location;
      this.facilityamenity.forEach(element => {
        let imageIcon = this.domSanitizer.bypassSecurityTrustHtml(element.amenity.icon);
        let id = element.amenity.id;
        let name = element.amenity.name;
        this.amenitiesList.push({ "icon": imageIcon, "id": id, "name": name });

      });
      let responseCode = response.headers.get('ResponseCode');
      switch (responseCode) {
        case ('2121'):
          this.dataReady = true;
          this.statusValue = this.facilityDetailsData.status
          this.getReview();
          this.showtextPendingForApproval = false;
          this.showVerifyButton = false;

          if (this.statusValue == 1 || this.statusValue == 2) {
            this.showtextPendingForApproval = true;
          }
          else if (this.statusValue == 2 || this.statusValue == 5) {
            this.showVerifyButton = true;
          }
          else if (this.statusValue == 1) {
            this.showVerifyButton = false;
          }
          break;
        case ('2342'):
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'There is some technical problem. Please contact administrator.';
          this.isSessionExpired = false;
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
        if (error.status == 500) {
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Internal server error';
          this.isSessionExpired = false;

        } else {
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Internal server error';
          this.isSessionExpired = false;
        }
      })



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

  showOverview() {
    this.forOverviewDesc = true;
    this.forwhatsAroundDesc = false;
    this.forPoliciesDesc = false;
    this.forReview = false;
    this.isShowTermsAndConditions = false;


  }
  showWhatsAround() {
    this.forwhatsAroundDesc = true;
    this.forOverviewDesc = false;
    this.forPoliciesDesc = false;
    this.forReview = false;
    this.isShowTermsAndConditions = false;
  }
  showPolicies() {
    this.forPoliciesDesc = true;
    this.forOverviewDesc = false;
    this.forwhatsAroundDesc = false;
    this.forReview = false;
    this.isShowTermsAndConditions = false;
  }
  showDeniedSection() {
    this.isDeniedSection = !this.isDeniedSection;
  }

  updateFacilityStatus(status) {
    let commentValue = this.advisorCommentBoxForm.controls['textAreaForComment'].value;
    if (commentValue != '') {

    }
    this.meetupService.updateFacilityStatusByAdvisor(this.facilityId, status, commentValue).subscribe(res => {
      let responseCode = res.headers.get('ResponseCode');
      switch (responseCode) {
        case '2341':
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Status updated successfully.';
          this.getFacility();
          break;
        case '2342':
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Failure';
          break;
        case '2343':
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Service provider blocked.';
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
        if (error.status == 500) {
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Internal server error';


        } else {
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Something went wrong in server';
        }
      })
  }
  getStatusText() {
    switch (this.statusValue) {
      case 1:
        this.facilityStatus = 'Pending For Approval';
        break;
      case 2:
        this.facilityStatus = 'Pending For Approval With Verify Request';
        break;
      case 3:
        this.facilityStatus = 'Rejected';
        break;
      case 4:
        this.facilityStatus = 'Rejected With Verify Request';
        break;
      case 5:
        this.facilityStatus = 'Verify request';
        break;
      case 6:
        this.facilityStatus = 'Reject Verify Request';
        break;
      case 7:
        this.facilityStatus = 'Approved and Not Verified';
        break;
      case 8:
        this.facilityStatus = 'Approved and Verified';
        break;
      case 9:
        this.facilityStatus = 'Deactivated by SP';
        break;
      case 10:
        this.facilityStatus = 'Verified And Stopped';
        break;
      case 11:
        this.facilityStatus = 'Blocked by advisor';
        break;
      case 12:
        this.facilityStatus = 'Verified And Blocked';
        break;
      case 13:
        this.facilityStatus = 'Blocked by admin';
        break;
      case 14:
        this.facilityStatus = 'Verified And Blocked by admin';
        break;
    }
    return this.facilityStatus;
  }
  veryFacility() {
    if (this.statusValue == 2) {
      this.meetupService.isShowPopup = true;
      this.meetupService.isWarningPopup = true;
      this.meetupService.popupMessage = 'Facilities cannot be verified before approval. ';

    }
    else {
      this.updateFacilityStatus(1);
    }
  }
  showReviews() {
    this.forOverviewDesc = false;
    this.forwhatsAroundDesc = false;
    this.forPoliciesDesc = false;
    this.forReview = true;
    this.isShowTermsAndConditions = false;
  }
  showTermsAndConditions() {
    this.forOverviewDesc = false;
    this.forwhatsAroundDesc = false;
    this.forPoliciesDesc = false;
    this.forReview = false;
    this.isShowTermsAndConditions = true;
  }
  getReview() {

    this.meetupService.getReviewsOfFacility(this.facilityId).subscribe(response => {
      this.listOfReviews = response;

    });

  }



}

