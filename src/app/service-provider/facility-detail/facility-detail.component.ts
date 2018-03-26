import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { ActivatedRoute, Router } from '@angular/router';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { initMapJS } from '../../../assets/js/customMap.js';

@Component({
  selector: 'facility-detail',
  templateUrl: 'facility-detail.component.html',
  styleUrls: ['facility-detail.component.css']


})
export class FacilityDetailComponent {
  data;
  dataReady;
  facilityTiming;
  facilityAmenitie;
  days = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  facilityId;
  facilityStatus;
  errorMsz: string = '';
  isSessionExpired: boolean;
  listOfLocations: any = [];
  facilityamenity: any;
  amenitiesList: any = [];
  facilityLocationNameData: any;

  isShowreview: boolean;
  isreview: boolean;
  isShowTermsAndConditions: boolean;

  edittext: string = '';
  listOfReviews = [];
  facilityTermsAndConditions: any;
  termsAndConditionDescription: any

  constructor(public meetupService: MeetupService, public domSanitizer: DomSanitizer, public route: ActivatedRoute, public router: Router) {
    // let snap = route.snapshot;
    // if (snap.url[0] != undefined) {
    //   this.meetupService.spPreviousURL = snap.url[0].path;
    // }
    this.meetupService.spPreviousURL = 'facility-detail';
  }

  ngOnInit() {
    initMapJS();
    this.facilityId = this.route.snapshot.paramMap.get('id');
    this.getFacility();
    this.readLocations();
    this.showOverview();

  }
  getFacility() {
    this.dataReady = false;
    this.meetupService.getfacilityById(this.facilityId).subscribe(response => {
      this.data = JSON.parse(response.text());
      this.facilityLocationNameData = this.data.location;
      this.facilityTermsAndConditions = this.data.location.facilityTermsConditionses.forEach(element => {
        this.termsAndConditionDescription = element.description;
        //console.log('terms' + this.termsAndConditionDescription);
      });

      this.facilityamenity = this.data.facilityAmenities;
      this.facilityamenity.forEach(element => {
        let imageIcon = this.domSanitizer.bypassSecurityTrustHtml(element.amenity.icon);
        let id = element.amenity.id;
        let name = element.amenity.name;
        this.amenitiesList.push({ "icon": imageIcon, "id": id, "name": name });

      });
      let responseCode = response.headers.get('ResponseCode');
      switch (responseCode) {
        case '2121':
          //check status
          this.getReview();
          if (this.data.status == '5' || this.data.status == '7' || this.data.status == '8' || this.data.status == '9' || this.data.status == '10') {
            this.edittext = 'Manage Facility';
          }
          else {
            this.edittext = 'Edit';
          }





          this.facilityTiming = this.data.facilityTimings;
          this.facilityAmenitie = this.data.facilityAmenities;
          this.dataReady = true;
          break;
        case '2122':
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

        if (error.status == 500) {
          this.errorMsz = 'Internal server error';


        } else {
          this.errorMsz = 'Something went wrong in server.';

        }
      });
  }
  getStatusName(statusId) {
    let status;
    switch (statusId) {
      case 1:
        status = 'Pending For Approval';
        break;
      case 2:
        status = 'Pending For Approval With Verify Request';
        break;
      case 3:
        status = 'Rejected';
        break;
      case 4:
        status = 'Rejected With Verify Request';
        break;
      case 5:
        status = 'Verify request';
        break;
      case 6:
        status = 'Reject Verify Request';
        break;
      case 7:
        status = 'Approved';
        break;
      case 8:
        status = 'Verified';
        break;
      case 9:
        status = 'Stopped';
        break;
      case 10:
        status = 'Verified And Stopped';
        break;
      case 11:
        status = 'Blocked';
        break;
      case 12:
        status = 'Verified And Blocked';
        break;
      case 13:
        status = 'Blocked by admin';
        break;
      case 14:
        status = 'Verified And Blocked by admin';
        break;
    }
    return status;
  }
  goToEditFacility() {
    this.router.navigate(['/service-provider/edit-facility/' + this.facilityId]);
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
  readLocations() {
    this.meetupService.getLocationBySP().subscribe(response => {
      this.listOfLocations = response;

    });
  }
  getLocationName(locationId) {
    let index = this.listOfLocations.findIndex(x => x.id == locationId);
    return index >= 0 ? this.listOfLocations[index].locationName : null;
  }

  showOverview() {
    this.isreview = false;
    this.isShowreview = true;
    this.isShowTermsAndConditions = false;
  }
  showReviews() {
    this.isreview = true;
    this.isShowreview = false;
    this.isShowTermsAndConditions = false;
  }
  showTermsAndConditions() {
    this.isreview = false;
    this.isShowreview = false;
    this.isShowTermsAndConditions = true;
  }
  getReview() {

    this.meetupService.getReviewsOfFacility(this.facilityId).subscribe(response => {
      this.listOfReviews = response;

    });

  }


}

