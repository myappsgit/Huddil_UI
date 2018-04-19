import { Component } from '@angular/core';

import { AdminService } from '../../../admin-providers/admin.services';

@Component({
    selector: 'admin-user-status-component',
    templateUrl: 'admin-user-status.component.html',
    styleUrls: ['admin-user-status.component.css']
})

export class AdminUserStatusComponent {

    userStatusArray = [];

    activeConsumers = 0;
    activeServiceProviders = 0;
    activeAdvisors = 0;
    totalActiveUsers = 0;

    disabledConsumers = 0;
    disabledServiceProviders = 0;
    disabledAdvisors = 0;
    totalDisabledUsers = 0;

    notActiveConsumers = 0;
    notActiveServiceProviders = 0;
    notActiveAdvisors = 0;
    totalNotActiveUsers = 0;

    constructor(public adminService: AdminService) {

    }

    ngOnInit() {

        this.getUserStatus();

    }

    getUserStatus() {
        let isOnline: boolean = navigator.onLine;

        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.adminService.getUserStatus().subscribe(res => {
                this.adminService.isLoading = false;
                let responsecode = res.headers.get('responsecode');
                if (responsecode == "4001") {
                    this.userStatusArray = JSON.parse(res.text());
                    this.getUserStatusDetails();
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

    getUserStatusDetails() {
        this.userStatusArray.forEach(userStatus => {
            if (userStatus.type == "Consumer" && userStatus.status == 1) {
                this.activeConsumers = userStatus.count;
            }
            else if (userStatus.type == "Service Provider" && userStatus.status == 1) {
                this.activeServiceProviders = userStatus.count;
            }
            else if (userStatus.type == "Advisor" && userStatus.status == 1) {
                this.activeAdvisors = userStatus.count;
            }
            else if (userStatus.type == "Consumer" && userStatus.status == 2) {
                this.disabledConsumers = userStatus.count;
            }
            else if (userStatus.type == "Service Provider" && userStatus.status == 2) {
                this.disabledServiceProviders = userStatus.count;
            }
            else if (userStatus.type == "Advisor" && userStatus.status == 2) {
                this.disabledAdvisors = userStatus.count;
            }
            else if (userStatus.type == "Consumer" && userStatus.status == 3) {
                this.notActiveConsumers = userStatus.count;
            }
            else if (userStatus.type == "Service Provider" && userStatus.status == 3) {
                this.notActiveServiceProviders = userStatus.count;
            }
            else if (userStatus.type == "Advisor" && userStatus.status == 3) {
                this.notActiveAdvisors = userStatus.count;
            }
        });

        this.totalActiveUsers = this.activeConsumers + this.activeServiceProviders + this.activeAdvisors;
        this.totalDisabledUsers = this.disabledConsumers + this.disabledServiceProviders + this.disabledAdvisors;
        this.totalNotActiveUsers = this.notActiveConsumers + this.notActiveServiceProviders + this.notActiveAdvisors;
    }
}