import { Component, ElementRef } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { Router } from '@angular/router';

import { closeJivoChatWindow } from '../../../assets/js/jivo.js';

@Component({
  selector: 'service-provider-header',
  templateUrl: './header.component.html',
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
  styleUrls: ['./header.component.css']
})
export class ServiceProviderHeaderComponent {

  isShowMenuPopup: boolean;
  userDetails = [];
  isUserDetailsReady: boolean;
  popupMessage: string = '';
  currentUser: any;

  constructor(private el: ElementRef, public meetupService: MeetupService, public router: Router) {




    if (sessionStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }
    else if (localStorage.getItem('authCookie')) {
      this.currentUser = JSON.parse(localStorage.getItem('authCookie'));
    }
  }
  onClickOutside(event) {
    if (!this.el.nativeElement.contains(event.target)) // similar checks
      this.isShowMenuPopup = false;
  }
  showLogOutPopUp() {
    this.isShowMenuPopup = !this.isShowMenuPopup;
  }


  logout() {
    this.isShowMenuPopup = false;
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
  closePopup() {
    this.meetupService.isShowPopup = false;
  }


}
