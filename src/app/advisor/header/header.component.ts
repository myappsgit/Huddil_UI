import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { MeetupService } from '../../provider/meetup.service';


@Component({
  selector: 'advisor-header',
  templateUrl: './header.component.html',
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
  styleUrls: ['./header.component.css']
})
export class AdvisorHeaderComponent {

  menuPopUp: boolean = false;
  notificationPopUp: boolean = false;
  isUserDetailsReady: boolean;

  userDetails = [];

  popupMessage: string = '';
  currentUser: any;

  constructor(private el: ElementRef, public router: Router, public meetupService: MeetupService) {
    if (sessionStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }
    else if (localStorage.getItem('authCookie')) {
      this.currentUser = JSON.parse(localStorage.getItem('authCookie'));
    }
  }
  onClickOutside(event) {
    if (!this.el.nativeElement.contains(event.target)) // similar checks
      this.menuPopUp = false;
  }
  showLogOutPopUp() {
    this.menuPopUp = !this.menuPopUp;
    this.notificationPopUp = false;
  }

  showNotificationPopUp() {
    this.notificationPopUp = !this.notificationPopUp;
    this.menuPopUp = false;
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.meetupService.logout().subscribe(response => {
      let responseCode = response.headers.get('ResponseCode');
      if (responseCode == "1611") {
        this.meetupService.sessionId = null;
        localStorage.clear();
        sessionStorage.clear();
        this.menuPopUp = false;
        this.meetupService.isLoggedIn = false;
        this.meetupService.popupMessage = 'Logged out successfully';
        this.meetupService.isShowPopup = true;


        this.router.navigate(['']);
      }

    });
  }
  closePopup() {
    this.meetupService.isShowPopup = false;
  }
}
