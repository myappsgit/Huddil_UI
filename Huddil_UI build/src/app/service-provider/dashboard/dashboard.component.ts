import { Component } from '@angular/core';
import { loadJivoChat } from '../../../assets/js/jivo.js';
import { createCallback } from '../../../assets/js/jivo.js';

import { MeetupService } from '../../provider/meetup.service';

import { Router } from '@angular/router';



@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(public meetupService: MeetupService, public router: Router) {

  }
  ngOnInit() {
    this.meetupService.getUserDetails().subscribe(res => {

      if (res != null) {
        let name = res.addressingName;
        let email = res.emailId;
        let mobile = res.mobileNo;
        createCallback(name, email, mobile);
        loadJivoChat();
      }
    });


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

}
