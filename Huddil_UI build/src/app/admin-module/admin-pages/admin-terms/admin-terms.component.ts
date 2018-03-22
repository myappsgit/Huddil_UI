import { Component } from '@angular/core';
import { AdminService } from '../../admin-providers/admin.services';

declare var jQuery: any;

@Component({
    selector: 'admin-terms-component',
    templateUrl: 'admin-terms.component.html',
    styleUrls: ['admin-terms.component.css']
})

export class AdminTermsComponent {

    showAddPolicyContainerBoolean: boolean = false;
    isSaveTermsError: boolean;
    listOfTermsAndConditions = [];
    fileData = {};
    successMessage: string;
    failureMessage: string;
    isLoading: boolean;

    isValidFile: boolean;
    isSavingTerms: boolean = false;


    constructor(public adminService: AdminService) {
        this.isSaveTermsError = true;
    }

    ngOnInit() {
        this.getListOfTCPS();
        jQuery(function () {
            jQuery("#active-date").datepicker({ dateFormat: 'yy-mm-dd', minDate: new Date() });
        });
        jQuery(function () {
            jQuery("#active-dateIcon").click(function () {

                jQuery('#active-date').datepicker('show');
            });

        });
    }

    getListOfTCPS() {
        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.listOfTermsAndConditions = [];
            this.adminService.getListOfTermsAndConditions().subscribe(res => {
                this.adminService.isLoading = false;
                let responsecode = res.headers.get('responsecode');
                if (responsecode == "1221") {
                    this.listOfTermsAndConditions = JSON.parse(res.text());
                } else if (responsecode == "1222") {
                    this.adminService.popupMessage = "TCPS read failur.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9997") {
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

    showAddPolicyContainer() {
        this.showAddPolicyContainerBoolean = !this.showAddPolicyContainerBoolean;

    }

    cancel() {
        this.emptyFields();
        this.showAddPolicyContainerBoolean = false;
    }

    emptyFields() {
        this.isSaveTermsError = false;
        jQuery('#active-date').val('');
        jQuery('#select-userType').val('');
        jQuery('#selectFile_input').val('');
        this.fileData = {};
    }

    saveTerms() {

        let date = jQuery('#active-date').val();
        let userType = jQuery('#select-userType').val();
        if (date == '' || userType == '' || !this.isValidFile) {
            alert('Fill all fields');
            this.isSaveTermsError = true;
        }

        else {
            this.isSaveTermsError = false;

            if (this.isSavingTerms == true) {
            } else {
                this.isSavingTerms = true;
                // let timer = setTimeout(() => {
                //     this.isSavingTerms = false;
                //     this.emptyFields();
                // }, 3000);
                this.addTermsAndContidions(date, userType);
            }

        }
    }

    addTermsAndContidions(date, userType) {

        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.isSavingTerms = true;
            this.adminService.addTermsAndConditions(this.fileData, date, userType).subscribe(res => {
                this.adminService.isLoading = false;
                this.isSavingTerms = false;
                this.emptyFields();
                let responsecode = res.headers.get('responsecode');
                if (responsecode == "1121") {
                    this.getListOfTCPS();
                    this.adminService.popupMessage = "Terms & Conditions file uploaded successfully.";
                    this.adminService.isSuccessPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "1122") {
                    this.adminService.popupMessage = "Terms & Conditions file upload failed.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9997") { //This response code is not in Swagger
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


    termsFileChange($event): void {
        this.readFile($event.target);
    }

    readFile(inputValue: any): void {
        this.isValidFile = false;
        if (inputValue.files.length == 0) {

        }
        else {
            var file: File = inputValue.files[0];

            this.fileData = inputValue.files[0];

            if (file.type == 'text/html') {
                var myReader: FileReader = new FileReader();
                this.isValidFile = true;

                myReader.onloadend = (e) => {
                }
                myReader.readAsDataURL(file);
            }
            else {
                this.fileData = {};
                this.isValidFile = false;
                this.adminService.isWarningPopup = true;
                this.adminService.isShowPopup = true;
                this.adminService.popupMessage = "Upload Only .html files";


            }

        }
    }

}