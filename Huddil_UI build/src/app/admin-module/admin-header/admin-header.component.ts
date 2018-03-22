import { Component, ElementRef } from '@angular/core';

import { AdminService } from '../admin-providers/admin.services';
import { MeetupService } from '../../provider/meetup.service';

import { Router } from '@angular/router';

@Component({
    selector: "admin-header",
    templateUrl: "admin-header.component.html",
    host: {
        '(document:click)': 'onClickOutside($event)',
    },
    styleUrls: ['admin-header.component.css']
})
export class AdminHeaderComponent {
    menuPopUp: boolean;
    constructor(public el: ElementRef, public adminService: AdminService, public router: Router, public meetupService: MeetupService) {

    }
    onClickOutside(event) {
        if (!this.el.nativeElement.contains(event.target)) // similar checks
            this.menuPopUp = false;
    }
    showMenu() {
        this.menuPopUp = !this.menuPopUp;
    }

    changePassword() {
        this.menuPopUp = !this.menuPopUp;
    }

    logout() {
        this.menuPopUp = false;
        sessionStorage.clear();
        localStorage.clear();
        this.adminService.logout().subscribe(response => {
            let responseCode = response.headers.get('ResponseCode');
            this.meetupService.sessionId = null;
            if (responseCode == "1611") {
                this.meetupService.isLoggedIn = false;
                this.adminService.isLoggedIn = false;
                this.adminService.adminSessionId = '';
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = 'Logged out successfully';
                this.router.navigate(['']);
            }

        });
    }

}