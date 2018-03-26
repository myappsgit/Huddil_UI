import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'order-confirm',
  templateUrl: 'order-confirmation.component.html',
  styleUrls: ['order-confirmation.component.css']
})
export class OrderConfirmationComponent {

  bookingId;
  teamArray: any = [];
  isShowMeetingDetailsContainer: boolean;
  form: FormGroup;
  isErrorInCreateMeeting: boolean;
  bookingDetails: any = [];
  facilityDetails: any = [];
  isSessionExpired: boolean;
  meetingCreateprocessStart: boolean;
  constructor(public route: ActivatedRoute, public meetupService: MeetupService, public fb: FormBuilder, public router: Router) {
    this.form = fb.group({
      title: ['', Validators.required],
      description: [''],
      location: ['',],
      team: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('id');
    this.getTeams();
    this.getBookingInformartion();
    this.facilityDetails = JSON.parse(sessionStorage.getItem('bookingDetails'));

  }
  getTeams() {
    this.meetupService.getTeamDetails().subscribe(res => {
      this.teamArray = res;


    })

  }
  getBookingInformartion() {
    this.meetupService.getBookingById(this.bookingId).subscribe(response => {
      let responseCode = response.headers.get('ResponseCode');
      switch (responseCode) {
        case '2101':
          this.bookingDetails = JSON.parse(response.text());
          this.bookingDetails = this.bookingDetails[0];
          if (this.bookingDetails == null) {
            this.meetupService.isShowPopup = true;
            this.meetupService.isWarningPopup = true;
            this.meetupService.popupMessage = 'Booking record not found';
            this.isSessionExpired = false;
            this.meetupService.isInvalidSessionPopupDisplayed = true;
          }
          break;
        case '2102':
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'There is some technical problem. Please contact administrator.';
          this.isSessionExpired = false;
          this.meetupService.isInvalidSessionPopupDisplayed = true;
          break;
        case '9996':
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'User is not allowed to perform this action';
          this.isSessionExpired = false;
          this.meetupService.isInvalidSessionPopupDisplayed = true;
          break;
        case '9999':
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Your session has expired. Please login again.';
          this.isSessionExpired = true;
          this.meetupService.isInvalidSessionPopupDisplayed = true;
          break;
        default:
          this.meetupService.isShowPopup = true;
          this.meetupService.isWarningPopup = true;
          this.meetupService.popupMessage = 'Unknown error code' + responseCode;
          this.isSessionExpired = true;
          this.meetupService.isInvalidSessionPopupDisplayed = true;

          break;
      }
      {

      }


    });
  }
  showMeetingDetailsContainer() {
    this.isShowMeetingDetailsContainer = !this.isShowMeetingDetailsContainer;
  }
  createMeeting() {
    let title = this.form.controls['title'].value;
    let team = this.form.controls['team'].value;
    let description = this.form.controls['description'].value;
    if (title == '' || team == '') {
      this.isErrorInCreateMeeting = true;
    }
    else {
      this.meetingCreateprocessStart = true;
      this.isErrorInCreateMeeting = false;
      let description = this.form.controls['description'].value;
      this.meetupService.createMeeting(this.bookingId, title, description, team).subscribe(response => {
        let responseCode = response.headers.get('responsecode');
        this.meetingCreateprocessStart = false;
        if (responseCode == '2911') {
          alert('Meeting created successfully');
          let navigationExtras: NavigationExtras = {
            queryParams: this.bookingDetails
          };
          this.router.navigate(['/consumer/my-bookings']);
          //this.showMeetingDetailsContainer();
        }
        else if (responseCode == '2912') {
          alert('Failure');
        }
        else if (responseCode == '2913') {
          alert('Meeting already created');
        }
      });
    }
  }
  goToFacilityDetailsPage() {
    this.router.navigate(['/consumer/facility-detail/' + this.facilityDetails.id]);
  }
  closePopup(type) {
    if (type == "1") {
      this.meetupService.isShowPopup = false;
      this.meetupService.forceLogoutWithoutSessionId();
      this.router.navigate(['']);
    }
    else if (type == "0") {
      this.meetupService.isShowPopup = false;
      this.meetupService.forceLogoutWithoutSessionId();
      this.router.navigate(['']);

    }

  }


}
