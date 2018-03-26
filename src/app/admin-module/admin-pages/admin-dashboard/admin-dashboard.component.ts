import { Component } from '@angular/core';

import { AdminService } from '../../admin-providers/admin.services';

@Component({
    selector: 'admin-dashboard',
    templateUrl: 'admin-dashboard.component.html',
    styleUrls: ['admin-dashboard.component.css']
})

export class AdminDashboardComponent {

    paymentStatusDetails: any = {};

    selectedYear = "";
    selectedMonth = "";

    constructor(public adminService: AdminService) {
        this.selectedYear = "" + (new Date()).getFullYear();
        this.selectedMonth = "" + ((new Date()).getMonth() + 1);

    }

    ngOnInit() {
        this.getPaymentStatus();
    }

    getPaymentStatus() {
        let isOnline: boolean = navigator.onLine;

        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;

            this.adminService.getPaymentStatus(this.selectedYear, this.selectedMonth).subscribe(res => {



                this.adminService.isLoading = false;
                let responsecode = res.headers.get('responsecode');

                if (responsecode == "4003") {
                    this.paymentStatusDetails = JSON.parse(res.text());
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
}

