import { Component, Input } from '@angular/core';
import { MeetupService } from '../../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'block-unblock',
  templateUrl: 'service-providers-details.component.html',
  styleUrls: ['service-providers-details.component.css'],
})
export class BlockUnblockServiceProviderComponent {

  form: FormGroup;

  showCommentBox: boolean = false;
  isLaoding: boolean;
  isSessionExpired: boolean;


  serviceProviderDetails: any;
  emailId: any;
  individualServiceProviderDetails: any;
  activeStatus: any;
  popupMessage: string = '';

  id: number;
  error: string = '';
  showCommentDialogue: boolean;

  constructor(public meetupService: MeetupService, public activatedRoute: ActivatedRoute, public fb: FormBuilder, public router: Router) {
    // API is not available to fetch the record based upon ID of Service Provider
    this.form = fb.group({
      commentBox: ['', Validators.required]
    })

  }

  ngOnInit() {

    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.serviceProviderDetails = params;
    //   if (this.serviceProviderDetails.active == "2") {
    //     this.showCommentBox = false;
    //   }
    //   else if (this.serviceProviderDetails.active == "1") {
    //     this.showCommentBox = true;
    //   }
    // });

    //User Status-Changed on-2.2.2018 Tuesday
    //-1 => Account not activated
    //0 => Account active. Email verifided. Mobile number not verified
    //1 => Account active. Email and Mobile both verified
    //2 => Account blocked. Mobile not verified
    //3 => Account blocked. Email and Mobile both verified

    this.activatedRoute.queryParams.subscribe(params => {
      this.serviceProviderDetails = params;
      if (this.serviceProviderDetails.active == "2" || this.serviceProviderDetails.active == "3") {
        this.showCommentBox = false;
      }
      else if (this.serviceProviderDetails.active == "0" || this.serviceProviderDetails.active == "1") {
        this.showCommentBox = true;
      }
    });
  }

  blockServiceProvider() {
    this.showCommentDialogue = !this.showCommentDialogue;
  }


  updateBlockStatus() {
    let comment = this.form.controls['commentBox'].value
    if (comment == '') {
      this.error = 'Please enter your comments';
    }
    else {
      this.meetupService.blockServiceProviderDetails(this.serviceProviderDetails.id, comment).subscribe(res => {

        let responseCode = res.headers.get('ResponseCode');
        switch (responseCode) {
          case ('2603'):
            this.meetupService.isShowPopup = true;
            this.meetupService.popupMessage = 'Blocked successfully';
            this.router.navigate(['/advisor/service-providers-list']);
            break;
          case ('2604'):
            this.meetupService.isShowPopup = true;
            this.meetupService.popupMessage = 'There is some technical problem. Please contact administrator.';
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

  }
  cancelBlockChanges() {
    this.showCommentDialogue = false;
  }
  hideBlockCommentBox() {
    this.showCommentBox = false;
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

  unblockServiceProvider() {
    this.meetupService.unblockServiceProviderDetails(this.serviceProviderDetails.id).subscribe(res => {
      this.individualServiceProviderDetails = res;
      let responseCode = res.headers.get('ResponseCode');
      switch (responseCode) {
        case ('2603'):
          this.meetupService.isShowPopup = true;
          this.meetupService.popupMessage = 'Activation successfully';
          this.router.navigate(['/advisor/service-providers-list']);
          break;
        case ('2604'):
          this.meetupService.isShowPopup = true;
          this.meetupService.popupMessage = 'There is some technical problem. Please contact administrator.';
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
}

