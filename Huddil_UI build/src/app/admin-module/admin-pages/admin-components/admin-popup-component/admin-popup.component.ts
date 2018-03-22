import { Component } from '@angular/core';

import { AdminService } from '../../../admin-providers/admin.services';
import { Router } from '@angular/router';

@Component({
    selector: 'admin-popup-component',
    templateUrl: 'admin-popup.component.html',
    styleUrls: ['admin-popup.component.css']
})

export class AdminPopupComponent {

    constructor(public adminService: AdminService, public router: Router) {

    }

    closePopup() {
        this.adminService.isShowPopup = false;

        this.adminService.isErrorPopup = false;
        this.adminService.isWarningPopup = false;
        this.adminService.isSuccessPopup = false;
    }
    closeSessionInvalidPopup() {

        this.adminService.isShowPopup = false;

        this.adminService.forceLogoutWithoutSessionId();
        this.router.navigate(['']);
    }
}
