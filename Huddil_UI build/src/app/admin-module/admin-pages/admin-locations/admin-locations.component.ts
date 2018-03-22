import { Component, ViewChild, Renderer, ElementRef, ContentChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../admin-providers/admin.services';
import { FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import * as $ from 'jquery'

@Component({
    selector: 'admin-locations',
    templateUrl: 'admin-locations.component.html',
    styleUrls: ['admin-locations.component.css']
})
export class AdminLocationsComponent {

    cityArray: any;
    form: FormGroup;
    selectedCity: string = "";
    noLocalityMsg: string = "";
    isLocalityNull: boolean;
    cityId: any;

    showLocalityListContainerBoolean: boolean = false;

    showAddCityContainerBoolean: boolean = false;
    showAddLocalityContainerBoolean: boolean = false;

    listOfLocalities: any;

    addCityForm = new FormGroup({
        svgDataTextArea: new FormControl('', Validators.required),
        cityNameInput: new FormControl('', Validators.required)
    });

    addLocalityForm = new FormGroup({
        locationNameInput: new FormControl('', Validators.required)
    });

    showAddCityErrorMessage: boolean = false;
    addCityErrorMessage = "";

    showLocalityErrorMessage: boolean = false;
    addLocalityErrorMessage = "";

    namePattern: RegExp = /^[a-zA-Z0-9 _\.-]+$/;

    constructor(public adminService: AdminService, fb: FormBuilder, private _router: Router) {
        this.form = fb.group({
            locationName: ['', Validators.required],
            serviceProviderSearchText: ['', Validators.required],
        })
        this.getListOfCities();
    }

    getListOfCities() {
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.adminService.getListOfCities().subscribe(res => {
                this.adminService.isLoading = false;
                let responsecode = res.headers.get('responsecode');
                if (responsecode == "2231") {
                    this.cityArray = JSON.parse(res.text());
                } else if (responsecode == "2232") {
                    this.adminService.popupMessage = "City read failur.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9996") {
                    this.adminService.popupMessage = "User is not allowed to perform this action.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9999") {
                    if (!this.adminService.isInvalisSessionPopup) {
                        this.adminService.isInvalisSessionPopup = true;
                        this.adminService.popupMessage = "Your session has expired. Please login again.";
                        this.adminService.isWarningPopup = true;
                        this.adminService.isShowPopup = true;
                    }
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

    //add city name
    addCity() {
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else if (!this.namePattern.test(this.addCityForm.controls['cityNameInput'].value)) {
            this.showAddCityErrorMessage = true;
            this.addCityErrorMessage = "Enter valid name"
        } else if (this.addCityForm.controls['cityNameInput'].value != '') {
            this.adminService.isLoading = true;
            let cityName = this.addCityForm.controls['cityNameInput'].value;
            this.adminService.addCity(cityName).subscribe(res => {
                let responseCode = res.headers.get('responsecode');
                this.adminService.isLoading = false;
                if (responseCode == "2221") {
                    this.getListOfCities();
                    this.emptyFields();
                    this.adminService.isSuccessPopup = true;
                    this.adminService.popupMessage = "City added successfully.";
                    this.adminService.isShowPopup = true;
                    this.cancel();
                } else if (responseCode == "2222") {
                    this.adminService.isWarningPopup = true;
                    this.adminService.popupMessage = "City add failure.";
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "2223") {
                    this.adminService.isWarningPopup = true;
                    this.adminService.popupMessage = "City already exists.";
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "9999") {
                    if (!this.adminService.isInvalisSessionPopup) {
                        this.adminService.isInvalisSessionPopup = true;
                        this.adminService.popupMessage = "Your session has expired. Please login again.";
                        this.adminService.isShowPopup = true;
                        this.adminService.isWarningPopup = true;
                    }
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

    getlocalityDataBasedOnSelectedCity(cityId) {
        // this.adminService.isLoading = true;
        // this.adminService.getLocalities(cityId).subscribe(res => {
        //     this.adminService.isLoading = false;
        //     this.listOfLocalities = res;
        //     this.showLocalityListContainerBoolean = true;
        //     if (this.listOfLocalities == '') {
        //         this.isLocalityNull = true;
        //         this.noLocalityMsg = "No locality found"
        //     } else if (this.listOfLocalities != '') {
        //         this.isLocalityNull = false;
        //         this.noLocalityMsg = ""
        //     }
        // });

        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.adminService.getLocalities(cityId).subscribe(res => {
                this.adminService.isLoading = false;
                let responsecode = res.headers.get('responsecode');
                if (responsecode == "2391") {
                    //console.log("Read Locality Successful.");
                    this.listOfLocalities = JSON.parse(res.text());
                    this.showLocalityListContainerBoolean = true;
                    if (this.listOfLocalities == '') {
                        this.isLocalityNull = true;
                        this.noLocalityMsg = "No locality found"
                    } else if (this.listOfLocalities != '') {
                        this.isLocalityNull = false;
                        this.noLocalityMsg = ""
                    }
                } else if (responsecode == "2392") {
                    this.adminService.popupMessage = "Read locality failure.";
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

    //add locality
    addLocality() {
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else if (!this.namePattern.test(this.addLocalityForm.controls['locationNameInput'].value)) {
            this.showLocalityErrorMessage = true;
            this.addLocalityErrorMessage = "Enter valid name"
        } else if (this.addLocalityForm.controls['locationNameInput'].value != '') {
            this.adminService.isLoading = true;
            let localityName = this.addLocalityForm.controls['locationNameInput'].value;
            this.adminService.addLocality(localityName, this.cityId).subscribe(res => {
                let responseCode = res.headers.get('responseCode');
                this.adminService.isLoading = false;
                //console.log("Response code:" + responseCode);
                if (responseCode == "2381") {
                    this.getlocalityDataBasedOnSelectedCity(this.cityId);
                    this.cancel();
                    this.adminService.isSuccessPopup = true;
                    this.adminService.popupMessage = "Locality added successfully.";
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "2382") {
                    this.adminService.isWarningPopup = true;
                    this.adminService.popupMessage = "Locality add failure.";
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "2383") {
                    this.adminService.isWarningPopup = true;
                    this.adminService.popupMessage = "Locality already exists.";
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "9999") {
                    if (!this.adminService.isInvalisSessionPopup) {
                        this.adminService.isInvalisSessionPopup = true;
                        this.adminService.popupMessage = "Your session has expired. Please login again.";
                        this.adminService.isShowPopup = true;
                        this.adminService.isWarningPopup = true;
                    }
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

    showAddCityContainer() {
        this.showAddCityContainerBoolean = !this.showAddCityContainerBoolean;
    }

    showAddLocalityContainer() {
        this.showAddLocalityContainerBoolean = !this.showAddLocalityContainerBoolean;
    }

    emptyFields() {
        this.addCityForm.controls['cityNameInput'].setValue("");
        this.addCityForm.controls['cityNameInput'].valueChanges;
        this.addLocalityForm.controls['locationNameInput'].setValue("");
        this.addLocalityForm.controls['locationNameInput'].valueChanges;

        this.addCityErrorMessage = "";
        this.addLocalityErrorMessage = "";
        this.showAddCityErrorMessage = false;
        this.showLocalityErrorMessage = false;
    }

    cancel() {
        this.showAddCityContainerBoolean = false;
        this.showAddLocalityContainerBoolean = false;
        this.emptyFields();
    }

    showListOfLocalitiesContainer(cityId) {

        $('.cityRow').removeClass('activeRow');
        $("#city" + cityId).addClass("activeRow");

        this.cityId = cityId;
        this.getlocalityDataBasedOnSelectedCity(cityId);
    }

}