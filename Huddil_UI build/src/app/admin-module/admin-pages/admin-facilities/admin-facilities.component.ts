import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AdminService } from '../../admin-providers/admin.services';

@Component({
    selector: 'admin-facilities',
    templateUrl: 'admin-facilities.component.html',
    styleUrls: ['admin-facilities.component.css']
})

export class AdminFacilitiesComponent {
    facilityStatusArray: any;

    forFacilityInfo: boolean;
    approvedFacility: number;
    pendingForApproval: number;
    deniedFacility: number;
    huddilVarified: number;
    pendingForVarification: number;
    rejectedVarification: number;
    blocked: number;
    deactivated: number;
    forFacilities: boolean;
    ForfailureMessage: boolean;
    facilityTypes: any;
    adminFacilityList = [];
    errorMessage: string;
    showFacilityErrorMessage: boolean;
    facilitySearchForm: FormGroup;

    searchText = "";
    searchForSelect = "";
    searchtypeSelect = "";

    //pagination
    totalPages;
    currentPage: number = 1;
    noOfRecordsInOnePage: number = 3;
    totalPaginationTabs: number = 0;

    constructor(public adminService: AdminService, fb: FormBuilder) {
        this.facilitySearchForm = fb.group({
            searchField: ['', Validators.required],
            searchFor: ['', Validators.required],
            searchType: ['', Validators.required]
        })
    }

    ngOnInit() {
        this.adminService.getFacilityList().subscribe(response => {
            this.facilityTypes = response;
        });
    }


    searchFacilities() {
        if (this.facilitySearchForm.controls['searchField'].value == "" || this.facilitySearchForm.controls['searchFor'].value == "" || this.facilitySearchForm.controls['searchType'].value == "") {
            this.errorMessage = "All fields are mandatory."
            this.showFacilityErrorMessage = true;
        } else {
            this.showFacilityErrorMessage = false;
            this.ForfailureMessage = false;
            this.searchText = this.facilitySearchForm.controls['searchField'].value ? this.facilitySearchForm.controls['searchField'].value : 0;
            this.searchForSelect = this.facilitySearchForm.controls['searchFor'].value ? this.facilitySearchForm.controls['searchFor'].value : 0;
            this.searchtypeSelect = this.facilitySearchForm.controls['searchType'].value ? this.facilitySearchForm.controls['searchType'].value : 0;


            this.searchFacilityByAdmin(1);
        }
    }

    searchFacilityByAdmin(page) {

        let isOnline: boolean = navigator.onLine;

        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {


            this.adminService.isLoading = true;
            this.adminService.searchFacilityByAdmin(this.searchText, this.searchForSelect, this.searchtypeSelect, page, this.noOfRecordsInOnePage).subscribe(result => {

                this.adminService.isLoading = false;

                this.adminFacilityList = JSON.parse(result.text());

                this.forFacilityInfo = true;
                if (page == 1) {
                    this.totalPages = result.headers.get('totalRecords');
                    // alert("totPages->" + this.totalPages);
                    this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);
                }
                let responseCode = result.headers.get('ResponseCode');

                if (responseCode == '2121' && this.adminFacilityList.length == 0) {
                    this.errorMessage = "No facilities found.";
                    this.ForfailureMessage = true;
                    this.forFacilityInfo = false;
                } else if (responseCode == '2122') {
                    this.adminService.popupMessage = "Facility read failure";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                }
                else if (responseCode == '9996') {
                    this.adminService.popupMessage = "User is not allowed to perform this action.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                }
                else if (responseCode == '9999') {
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

    facilityByPagination(page) {
        this.searchFacilityByAdmin(page);
    }
}
