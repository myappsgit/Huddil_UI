import { Component, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { MeetupService } from '../../provider/meetup.service';

//import { loadJivoChat } from '../../../assets/js/jivo.js';
//import { createCallback } from '../../../assets/js/jivo.js';


@Component({
  selector: 'consumer-header',
  templateUrl: './header.component.html',
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
  styleUrls: ['./header.component.css']
})
export class ConsumerHeaderComponent {
  @Input() isTransparent: boolean = false;
  isShowMenuPopup: boolean;
  userDetails: any = [];
  isUserDetailsReady;
  popupMessage: string = '';
  currentUser: any;

  constructor(private el: ElementRef, public router: Router, public meetupService: MeetupService) {
    //loadJivoChat();
    if (sessionStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }
    else if (localStorage.getItem('authCookie')) {
      this.currentUser = JSON.parse(localStorage.getItem('authCookie'));
    }
    this.meetupService.consumerUserData = sessionStorage.getItem('consumerName');
    console.log(this.meetupService.consumerUserData);
  }
  ngOnInit() {

  }

  onClickOutside(event) {
    if (!this.el.nativeElement.contains(event.target)) // similar checks
      this.isShowMenuPopup = false;
  }
  goToLogin() {

    this.meetupService.previousUrl = this.router.url;
    this.meetupService.isLoginPopUp = true;

  }
  goToSPSignup() {
    this.router.navigate(['/service-provider-signup']);
  }

  showMenuPopup() {
    this.isShowMenuPopup = !this.isShowMenuPopup;
  }
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.meetupService.logout().subscribe(response => {
      let responseCode = response.headers.get('ResponseCode');

      if (responseCode == "1611") {
        this.meetupService.sessionId = null;
        this.isShowMenuPopup = false;
        this.meetupService.isLoggedIn = false;
        this.meetupService.isShowPopup = true;
        this.meetupService.popupMessage = 'Logged out successfully';

        this.router.navigate(['']);
      }
      // else {
      //   this.meetupService.forceLogoutWithoutSessionId();
      //   this.router.navigate(['']);
      // }

    });
  }
  goTofavourite() {
    this.router.navigate(['consumer/favourite-listing']);
  }
  goToAttendees() {
    this.router.navigate(['consumer/attendees-list']);
  }
  goToChangePassword() {
    this.router.navigate(['consumer/change-password']);
  }
  goHomePage() {
    this.router.navigate(['']);
  }
  closePopup() {
    this.meetupService.isShowPopup = false;
  }

  goToEditProfilePage() {
    this.router.navigate(['consumer/edit-profile']);
  }
  showHowItWorks() {
    this.meetupService.isShowHowItWorksPopup = true;
  }


}
