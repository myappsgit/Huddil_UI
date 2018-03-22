import { Component } from '@angular/core';
import { FacebookService } from './social-authentication/facebook.service';
import { MeetupService } from './provider/meetup.service';
import { closeJivoChatWindow } from '../assets/js/jivo.js';
import { Router, NavigationEnd } from '@angular/router';
import { loadJivoChat } from '../assets/js/jivo.js';
import { createCallback } from '../assets/js/jivo.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Meetup';
  userType: any;

  constructor(public facebook: FacebookService, public meetupService: MeetupService, public router: Router) {
    setInterval(function () {

      loadJivoChat();
    }, 6000);

    if (sessionStorage.getItem('currentUser')) {
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.userType = currentUser.userType;

    }
    this.router.events.subscribe(() => {
      window.scroll(0, 0);
    })

    if (this.meetupService.listOfCities.length == 0 || this.meetupService.listOfCities == null) {
      this.meetupService.getCity();
    }
    if (this.meetupService.listOfFacilityType.length == 0 || this.meetupService.listOfFacilityType == null) {
      this.meetupService.getFacilityType();
    }
    if (this.meetupService.listOfAmenities.length == 0 || this.meetupService.listOfAmenities == null) {
      this.meetupService.getAmenities();
    }

    // if (!this.meetupService.isLoggedIn) {
    //   closeJivoChatWindow();
    // }

    //facebook.init();



  }
  closePopUp() {
    this.meetupService.isMobileNumberPopupForConsumer = false;
    this.meetupService.isLoginPopUp = false;

  }
  closeCalendarPopUp() {
    this.meetupService.isShowCalendarPopup = false;
  }
  closeShowHowItWorks() {
    this.meetupService.isShowHowItWorksPopup = false;
  }
  closeConsumerTCPSPopup() {
    this.meetupService.isShowConsumerTCPSPopup = false;
  }
  closeSPTCPSPopup() {
    this.meetupService.isShowSPTCPSPopup = false;
  }
  updateTCPSForUser() {

    this.meetupService.updateUsersTCPS().subscribe(res => {
      let responseCode = res.headers.get('ResponseCode');
      switch (responseCode) {
        case '1321':
          this.meetupService.isShowTCPSLoginPopUp = false;
          sessionStorage.removeItem('isLatestTCPS');
          break;
        case '1322':
          alert('There is some technical problem. Please contact administrator.');
          break;
        default:
          alert('Unkown response code:' + responseCode);
          break;
      }

    });
  }
  denyTCPSrequest() {
    if (confirm('Are you sure want to deny.')) {
      this.meetupService.isShowTCPSLoginPopUp = false;
      sessionStorage.clear();
      localStorage.clear();
      this.meetupService.logout().subscribe(response => {
        let responseCode = response.headers.get('ResponseCode');
        this.meetupService.sessionId = null;
        if (responseCode == "1611") {
          //closeJivoChatWindow();
          this.meetupService.isLoggedIn = false;
          this.meetupService.sessionId = '';
          this.meetupService.isShowPopup = true;
          this.meetupService.popupMessage = 'Logged out successfully';
          this.router.navigate(['']);
        }

      });
    }

  }


}
