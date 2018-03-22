import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';
import { Router, RouterModule, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'service-providers-list',
  templateUrl: 'service-providers-list.component.html',
  styleUrls: ['service-providers-list.component.css'],
})
export class ServiceProvidersListomponent {

  searchForm: FormGroup;

  serviceProviderDetails: any;

  isShowFilterBox: boolean;
  showServiceProviderDetails: boolean;
  isNoData: boolean;
  isSessionExpired: boolean;
  showLoader: boolean;

  errorMessage: string = '';
  activeStatus: string = '';

  constructor(public meetupService: MeetupService, fb: FormBuilder, public router: Router) {
    this.searchForm = fb.group({
      searchControl: ['', Validators.required]
    })
  }

  ngOnInit() {
    //this.getSPList();
  }

  getSPList() {
    this.showLoader = true;
    this.errorMessage = '';
    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      this.showLoader = false;
      this.errorMessage = 'You are offline. Please check your network';
    } else {
      this.meetupService.getserviceProviderDetails().subscribe(res => {
        this.showLoader = false;
        this.serviceProviderDetails = JSON.parse(res.text());

        if (this.serviceProviderDetails == '') {
          this.isNoData = true;
          this.showServiceProviderDetails = false;
        }
        else if (this.serviceProviderDetails != '') {

          let responseCode = res.headers.get('ResponseCode');
          switch (responseCode) {
            case ('2601'):
              this.isNoData = false;
              this.showServiceProviderDetails = true;
              break;
            case ('9996'):
              this.showLoader = false;
              this.isNoData = false;
              this.showServiceProviderDetails = false;
              this.errorMessage = 'There is some technical problem. Please contact administrator.';
              break;
            case ('9999'):
              this.showLoader = false;
              if (!this.meetupService.isInvalidSessionPopupDisplayed) {
                this.meetupService.isShowPopup = true;
                this.meetupService.isWarningPopup = true;
                this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                this.isSessionExpired = true;
                this.meetupService.isInvalidSessionPopupDisplayed = true;
              }
              break;

            default:
              this.showLoader = false;
              if (!this.meetupService.isInvalidSessionPopupDisplayed) {
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
            this.showLoader = false;
            this.errorMessage = 'Internal server error';

          } else {
            this.showLoader = false;
            this.errorMessage = 'Something went wrong in server';
          }
        })
    }
  }
  showExtraFilterBox() {
    this.isShowFilterBox = !this.isShowFilterBox

  }

  getServiceProviderDetails() {
    this.showLoader = true;
    this.showServiceProviderDetails = false;
    this.errorMessage = '';
    this.isNoData = false;
    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      this.showLoader = false;
      this.errorMessage = 'You are offline. Please check your network';
    } else {
      let seachValue = this.searchForm.controls['searchControl'].value;
      this.meetupService.getServiceProviderDetailsForAdvisor(seachValue).subscribe(res => {
        this.showLoader = false;
        this.serviceProviderDetails = JSON.parse(res.text());
        if (this.serviceProviderDetails == '') {
          this.isNoData = true;
          this.showServiceProviderDetails = false;
        }
        else if (this.serviceProviderDetails != '') {

          let responseCode = res.headers.get('ResponseCode');
          switch (responseCode) {
            case ('2601'):
              this.isNoData = false;
              this.showServiceProviderDetails = true;
              break;
            case ('9996'):
              this.isNoData = false;
              this.showServiceProviderDetails = false;
              this.errorMessage = 'There is some technical problem. Please contact administrator.';
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
        }
      },
        (error) => {
          if (error.status == 500) {
            this.errorMessage = 'Internal server error';

          } else {
            this.errorMessage = 'Something went wrong in server';
          }
        })
    }
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

  showFacilityDetailsPage(serviceProviderObj) {
    let navigationExtras: NavigationExtras = {
      queryParams: serviceProviderObj
    };
    this.router.navigate(['advisor/service-providers-list/service-providers-details'], navigationExtras);
  }
  getUserStatus(status) {
    let statusText: string = '';
    switch (status) {
      case 2:
        statusText = "Blocked";
        break;
      case 0:
        statusText = "Blocked";
        break;
      case -1:
        statusText = "Blocked";
        break;
      case 1:
        statusText = "Unblocked";
        break;
    }
    return statusText;

  }


}