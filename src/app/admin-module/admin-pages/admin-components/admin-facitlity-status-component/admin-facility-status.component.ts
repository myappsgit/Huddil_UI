import { Component } from '@angular/core';

import { AdminService } from '../../../admin-providers/admin.services';

@Component({
    selector: 'admin-facility-status-component',
    templateUrl: 'admin-facility-status.component.html',
    styleUrls: ['admin-facility-status.component.css']
})

export class AdminFacilityStatusComponent {

    facilityStatusArray = [];

    approvedFacilities = 0;
    pendingForApproval = 0;
    deniedFacilities = 0;

    huddilVerified = 0;
    pendingVerification = 0;
    rejectedVerification = 0;

    blocked = 0;
    deactivated = 0;

    constructor(public adminService: AdminService) {

    }

    ngOnInit() {
        this.getFacilityStatus();
    }

    getFacilityStatus() {
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.adminService.getFacilityStatus().subscribe(res => {
                this.adminService.isLoading = false;
                let responsecode = res.headers.get('responsecode');
                if (responsecode == "4002") {
                    this.facilityStatusArray = JSON.parse(res.text());
                    this.getFacilityStatusDetails();
                } else if (responsecode == "9996") {
                    this.adminService.popupMessage = "User is not allowed to perform this action.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9999") {
                    this.adminService.isInvalisSessionPopup = true;
                    this.adminService.popupMessage = "Your session has expired. Please login again.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                }
            }, (error) => {
                this.adminService.isLoading = false;
                if (error.status == 500) {
                    this.adminService.popupMessage = "Internal server error";
                    this.adminService.isShowPopup = true;
                    this.adminService.isWarningPopup = true;
                } else if (error.status == 400) {
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                    this.adminService.popupMessage = "Bad request";
                } else if (error.status == 401) {
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                    this.adminService.popupMessage = "Unauthorized";
                } else if (error.status == 403) {
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                    this.adminService.popupMessage = "Forbidden";
                } else if (error.status == 404) {
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                    this.adminService.popupMessage = "Not Found";
                } else {
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                    this.adminService.popupMessage = 'Something went wrong in server.';
                }
            });
        }
    }


    getFacilityStatusDetails() {
        // Status 1: Pending for approval + Pending for approval with Huddil Verification. (Status 1 & 2 in DB) - this.pendingForApproval
        // Status 2: Rejected facility request + Rejected facility request with Huddil Verification. - this.deniedFacilities
        // Status 3: Huddil verification request made.(Status 5 in DB) - this.pedingVerification
        // Status 4: Huddil verification request denied. - this.rejectedVerification
        // Status 5: Approved + Approved with Huddil verification. - this.approvedFacilities
        // Status 6: Huddil verified facilities. - this.huddilVerified
        // Status 7: Deactivated facilities approved by SP + Deactivated facilities with Huddil verification by SP. - this.deactivated
        // Status 8: Blocked by advisor + Blocked by Admin + Verified and Blocked by Admin + Verified and blocked by Advisor. -this.blocked

        this.facilityStatusArray.forEach(facilityStatus => {
            if (facilityStatus.status == 1) {
                this.pendingForApproval = facilityStatus.count;
            }
            if (facilityStatus.status == 2) {
                this.deniedFacilities = facilityStatus.count;
            }
            if (facilityStatus.status == 3) {
                this.pendingVerification = facilityStatus.count;
            }
            if (facilityStatus.status == 4) {
                this.rejectedVerification = facilityStatus.count;
            }
            if (facilityStatus.status == 5) {
                this.approvedFacilities = facilityStatus.count;
            }
            if (facilityStatus.status == 6) {
                this.huddilVerified = facilityStatus.count;
            }
            if (facilityStatus.status == 7) {
                this.deactivated = facilityStatus.count;
            }
            if (facilityStatus.status == 8) {
                this.blocked = facilityStatus.count;
            }
        });
    }

}