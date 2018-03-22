import { Component, ViewChild, Renderer, ElementRef, ContentChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { AdminService } from '../../admin-providers/admin.services';

@Component({
    selector: 'admin-amenities',
    templateUrl: 'admin-amenities.component.html',
    styleUrls: ['admin-amenities.component.css']
})

export class AdminAmenitiesComponent {
    aminitiesData: any;

    amenitiesDetailsArray = [];

    showAddAmenityContainerBoolean: boolean = false;

    addAmenityForm = new FormGroup({
        svgDataTextArea: new FormControl('', Validators.required),
        amenityNameInput: new FormControl('', Validators.required)
    });

    showAddAmenityErrorMessage: boolean = false;
    addAmenitiesErrorMessage = "";

    errorMessage: string;

    constructor(public adminService: AdminService, private domSanitizer: DomSanitizer) { }

    ngOnInit() {
        this.getAmenities();

        this.initInputFields();
    }

    initInputFields() {
        this.addAmenityForm.controls['svgDataTextArea'].valueChanges.subscribe(value => {
            if (value != "") {
                this.addAmenitiesErrorMessage = "";
                this.showAddAmenityErrorMessage = false;
            }
        });

        this.addAmenityForm.controls['amenityNameInput'].valueChanges.subscribe(value => {
            if (value != "") {
                this.addAmenitiesErrorMessage = "";
                this.showAddAmenityErrorMessage = false;
            }
        });
    }

    getAmenities() {
        this.aminitiesData = [];
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.adminService.getAmenities().subscribe(res => {
                this.adminService.isLoading = false;
                let responsecode = res.headers.get('responsecode');
                if (responsecode == "2281") {
                    this.aminitiesData = JSON.parse(res.text());
                    this.addAmenityImages();
                } else if (responsecode == "2282") {
                    this.adminService.popupMessage = "Amenity read failur.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9997") { //This response code is not in Swagger
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

    addAmenityImages() {
        this.amenitiesDetailsArray = [];
        this.aminitiesData.forEach(element => {
            let imageIcon = this.domSanitizer.bypassSecurityTrustHtml(element.icon);
            element.icon = imageIcon;
            this.amenitiesDetailsArray.push(element);
        });
    }

    showAddAmenitiesContainer() {
        this.showAddAmenityContainerBoolean = !this.showAddAmenityContainerBoolean;
    }

    emptyFields() {
        this.addAmenityForm.controls['svgDataTextArea'].setValue("");
        this.addAmenityForm.controls['svgDataTextArea'].valueChanges;
        this.addAmenityForm.controls['amenityNameInput'].setValue("");
        this.addAmenityForm.controls['amenityNameInput'].valueChanges;
    }

    cancel() {
        this.showAddAmenityContainerBoolean = false;
        this.emptyFields();
    }

    onSave() {
        let userNamePattern: RegExp = /^[a-zA-Z0-9 _\.-]+$/;
        if (this.addAmenityForm.controls['svgDataTextArea'].value == "" || this.addAmenityForm.controls['amenityNameInput'].value == "") {
            this.showAddAmenityErrorMessage = true;
            this.addAmenitiesErrorMessage = "Both fields are mandatory."
        }
        else if (!userNamePattern.test(this.addAmenityForm.controls['amenityNameInput'].value)) {
            this.showAddAmenityErrorMessage = true;
            this.addAmenitiesErrorMessage = "Enter valid name"
        } else {
            this.showAddAmenityErrorMessage = false;
            this.showAddAmenityContainerBoolean = false;
            let svgData = this.addAmenityForm.controls['svgDataTextArea'].value.toString();

            //let fielddata = this.form.controls['svgText'].value.toString();

            //Gopi: To escpae "=> \"
            //let svgData = this.textAreaValue.replace(/"/g, "\\\"");

            //Gopi: To remove all the newline characters
            let svgData2 = svgData.replace(/(\r\n|\n|\r)/gm, "");

            //Gopi:To remove space. Don't do this. It removes all whitespace. 
            //For example: "svg width"->"svgwidth"
            //let svgData3=svgData.replace(/\s/g,'');

            let nameText = this.addAmenityForm.controls['amenityNameInput'].value.toString();


            this.addAmenity(svgData2, nameText);


        }

    }

    addAmenity(svgData, name) {
        let isOnline: boolean = navigator.onLine;

        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;


            this.adminService.addAmenity(svgData, name).subscribe(res => {
                let responseCode = res.headers.get('responsecode');


                this.adminService.isLoading = false;

                if (responseCode == "2271") {
                    this.getAmenities();
                    this.emptyFields();
                    this.adminService.isSuccessPopup = true;
                    this.adminService.popupMessage = "Amenity added successfully.";
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "2272") {
                    this.adminService.isWarningPopup = true;
                    this.adminService.popupMessage = "Amenity add failure.";
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "2273") {
                    this.adminService.isWarningPopup = true;
                    this.adminService.popupMessage = "Amenity already exists.";
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
}
