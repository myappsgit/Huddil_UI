import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { AdminService } from '../../admin-providers/admin.services';

import { AdminUserStatusComponent } from '../admin-components/admin-user-status-component/admin-user-status.component';

@Component({
    selector: 'admin-users',
    templateUrl: 'admin-users.component.html',
    styleUrls: ['admin-users.component.css']
})

export class AdminUsersComponent {

    //Method 1
    // @ViewChild('adminUserStatusComponent') adminUserStatusComponent;


    //Method 2
    @ViewChild(AdminUserStatusComponent) adminUserStatusComponent2;

    showAddNewAdvisorContainerBoolean = false;

    userInfoDetailsArray = [];

    spCommissionArray: any = [];

    showInfoComponent: boolean;
    errorMessage: string;
    showAddAdvisorErrorMessage: boolean;
    showUserInfoContainer: boolean;

    successMessage: string;

    emailExistErrorMessage: string = '';
    showEmailErrorMessage: boolean;

    mobileNumberErrorMessage: string = '';
    showMobileNumberExistsMessage: boolean;

    showErrorMessageContainer: boolean;
    findErrorMessage: string;

    showErrorMessage: boolean;
    showNotFoundErrorMessage: boolean;

    emailErrorMessage: string;

    showPasswordErrorMessage: boolean;
    passwordErrorMessage: string;
    isThePasswordValid: boolean;

    userInfoSearchForm: FormGroup;
    addAdvisorForm: FormGroup;

    searchText: string = "";
    userType: string = "";

    disableSaveButton: boolean = false;

    isNameValid: boolean = false;
    isEmailValid: boolean = false;
    //isMobileNoValid: boolean = false;

    constructor(public adminService: AdminService, public fb: FormBuilder) {

        this.userInfoSearchForm = fb.group({
            searchInputField: ['', Validators.required],
            selectUserType: ['', Validators.required],
        })

        this.addAdvisorForm = fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
        })
    }

    ngOnInit() {
        this.initNameValidation();
        this.emailIdValidation();
        //this.mobileNumberValidation();
        this.initPasswordLengthValidation();
    }

    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }

    initNameValidation() {
        this.addAdvisorForm.controls['name'].valueChanges.subscribe(value => {
            let userNamePattern: RegExp = /^[a-zA-Z0-9 _\.-]+$/;

            if (value.length > 0) {


                if (!userNamePattern.test(value)) {

                    this.errorMessage = "Enter valid name";
                    this.showAddAdvisorErrorMessage = true;
                    this.isNameValid = false;
                } else {
                    this.errorMessage = "";
                    this.showAddAdvisorErrorMessage = false;
                    this.isNameValid = true;
                }
            } else {
                this.errorMessage = "Please enter name";
                this.showAddAdvisorErrorMessage = true;
                this.isNameValid = false;
            }

        });
    }

    emailIdValidation() {
        this.addAdvisorForm.controls['email'].valueChanges.subscribe(value => {
            let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (value.length > 0) {
                if (!emailPattern.test(value)) {
                    this.emailErrorMessage = "Please enter valid email ID";
                    this.showEmailErrorMessage = true;
                    this.isEmailValid = false;
                } else {
                    this.emailErrorMessage = "";
                    // this.adminService.checkEmailIdAvailability(value);

                    this.adminService.checkEmailIdAvailability(value).subscribe(response => {
                        let responseCodeForEmailId = response.headers.get('ResponseCode');

                        if (responseCodeForEmailId == '1021') {
                            this.emailErrorMessage = "EmailId registred. Use different emai id.";
                            this.showEmailErrorMessage = true;
                            this.isEmailValid = false;

                        }
                        else {
                            this.showEmailErrorMessage = false;
                            this.isEmailValid = true;

                        }
                    });

                }
            } else {
                this.emailErrorMessage = "Please enter email ID";
                this.showEmailErrorMessage = false;
                this.isEmailValid = false;
            }
        });
    }

    // mobileNumberValidation() {
    //     this.addAdvisorForm.controls['mobileNumber'].valueChanges.subscribe(value => {
    //         let mobilePattern = /[0-9]/;
    //         if (value.length > 0 && value.length <= 10) {
    //             if (!mobilePattern.test(value)) {
    //                 this.mobileNumberErrorMessage = "Please enter ealid mobile nmber";
    //                 this.showMobileNumberExistsMessage = true;
    //                 this.isMobileNoValid = false;

    //             } else if (value.length < 10) {
    //                 this.mobileNumberErrorMessage = "Please enter valid mobile number";
    //                 this.showMobileNumberExistsMessage = true;
    //                 this.isMobileNoValid = false;
    //             }
    //             else {
    //                 if (value.length == 10) {
    //                     //this.adminService.checkMobileNumberAvailability(value);
    //                     this.adminService.checkMobileNumberAvailability(value).subscribe(result => {
    //                         let responseCodeForMobileNumber = result.headers.get('ResponseCode');

    //                         if (responseCodeForMobileNumber == '1031') {
    //                             this.mobileNumberErrorMessage = "Mobile number already registered.";
    //                             this.showMobileNumberExistsMessage = true;
    //                             this.isMobileNoValid = false;

    //                         }
    //                         else {
    //                             this.showMobileNumberExistsMessage = false;
    //                             this.isMobileNoValid = true;
    //                         }
    //                     })
    //                 }
    //                 this.mobileNumberErrorMessage = "";
    //             }
    //         } else if (value.length > 10) {
    //             this.mobileNumberErrorMessage = "Please enter a valid mobile number";
    //             this.showMobileNumberExistsMessage = true;
    //             this.isMobileNoValid = false;
    //         }
    //         else {
    //             this.mobileNumberErrorMessage = "Please enter mobile number";
    //             this.showMobileNumberExistsMessage = false;
    //             this.isMobileNoValid = false;
    //         }
    //     });
    // }

    initPasswordLengthValidation() {
        this.addAdvisorForm.controls['password'].valueChanges.subscribe(value => {

            if (value.length > 0) {
                if (value.length < 6) {
                    this.showPasswordErrorMessage = true;
                    this.passwordErrorMessage = "Password must be 6 characters long";
                    this.isThePasswordValid = false;

                } else if (value.length > 15) {
                    this.showPasswordErrorMessage = true;
                    this.passwordErrorMessage = "Password must be maximum 15 letters";
                    this.isThePasswordValid = false;

                } else {
                    this.showPasswordErrorMessage = false;
                    this.passwordErrorMessage = "";
                    this.isThePasswordValid = true;

                }
            } else {
                this.showPasswordErrorMessage = true;
                this.passwordErrorMessage = "Enter password";
                this.isThePasswordValid = false;

            }
        });
    }

    emptyFields() {
        //this.showAddNewAdvisorContainerBoolean = false;
        this.addAdvisorForm.controls['name'].setValue("");
        this.addAdvisorForm.controls['name'].valueChanges;
        this.addAdvisorForm.controls['email'].setValue("");
        this.addAdvisorForm.controls['email'].valueChanges;
        this.addAdvisorForm.controls['mobileNumber'].setValue("");
        this.addAdvisorForm.controls['mobileNumber'].valueChanges;
        this.addAdvisorForm.controls['password'].setValue("");
        this.addAdvisorForm.controls['password'].valueChanges;

        this.showAddAdvisorErrorMessage = false;
        this.showEmailErrorMessage = false;
        this.showMobileNumberExistsMessage = false;
        this.showPasswordErrorMessage = false;
    }

    cancel() {
        // this.showEmailErrorMessage = false;
        this.showAddNewAdvisorContainerBoolean = false;
        this.emptyFields();
    }

    findUsers() {

        if (this.userInfoSearchForm.controls['searchInputField'].value == "" || this.userInfoSearchForm.controls['selectUserType'].value == "") {
            this.findErrorMessage = "All fields are mandatory.";
            this.showErrorMessageContainer = true;
        }
        else {
            this.showErrorMessageContainer = false;
            this.showErrorMessage = false;
            this.searchText = this.userInfoSearchForm.controls['searchInputField'].value ? this.userInfoSearchForm.controls['searchInputField'].value : 0;
            this.userType = this.userInfoSearchForm.controls['selectUserType'].value ? this.userInfoSearchForm.controls['selectUserType'].value : 0;

            this.searchUser();
        }
    }

    searchUser() {
        let isOnline: boolean = navigator.onLine;

        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.adminService.searchUser(this.searchText, this.userType).subscribe(response => {

                this.adminService.isLoading = false;

                let responseCode = response.headers.get('ResponseCode');
                //console.log("ResponseCode:" + responseCode);
                let userInfoSearchDetails = JSON.parse(response.text());
                this.userInfoDetailsArray = [];
                if (responseCode == '2601' && userInfoSearchDetails == '') {
                    this.errorMessage = "User not found.";
                    this.showErrorMessage = true;
                } else if (responseCode == '2601' && userInfoSearchDetails != '') {
                    //this.adminUserStatusComponent.getUserStatus();
                    this.adminUserStatusComponent2.getUserStatus();
                    // this.showUserInfoContainer = true;
                    userInfoSearchDetails.forEach(userInfo => {
                        //User Status-Changed on-2.2.2018 Tuesday
                        //-1 => Account not activated
                        //0 => Account active. Email verifided. Mobile number not verified
                        //1 => Account active. Email and Mobile both verified
                        //2 => Account blocked. Mobile not verified
                        //3 => Account blocked. Email and Mobile both verified
                        // if (userInfo.active == 1 || userInfo.active == 2) {
                        if (userInfo.active != -1) {
                            this.userInfoDetailsArray.push(userInfo);
                        }
                    })
                    if (this.userType == "service provider") {
                        this.getSPCommissionByAdmin();
                    } else {
                        this.showUserInfoContainer = true;
                    }
                } else if (responseCode == "9996") {
                    this.adminService.popupMessage = "User is not allowed to perform this action.";
                    this.adminService.isShowPopup = true;
                    this.adminService.isWarningPopup = true;
                } else if (responseCode == "9998") {
                    this.adminService.popupMessage = "Invalid user type.";
                    this.adminService.isShowPopup = true;
                    this.adminService.isWarningPopup = true;
                } else if (responseCode == "9999") {
                    this.adminService.popupMessage = "Your session has expired. Please login again.";
                    this.adminService.isShowPopup = true;
                    this.adminService.isWarningPopup = true;
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

    getSPCommissionByAdmin() {

        //console.log("From getSPCommissionByAdmin()");

        let currentYear = "" + (new Date()).getFullYear();
        let currentMonth = "" + ((new Date()).getMonth() + 1);

        let spIdsString = "";
        this.userInfoDetailsArray.forEach(userInfo => {
            spIdsString = spIdsString + userInfo.id + ",";
        });

        let isOnline: boolean = navigator.onLine;
        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.adminService.getSPCommissionByAdmin(spIdsString, currentMonth, currentYear).subscribe(response => {

                this.adminService.isLoading = false;

                let responseCode = response.headers.get('ResponseCode');
                //console.log("ResponseCode:" + responseCode);
                let spCommissionDetails = JSON.parse(response.text());

                this.spCommissionArray = [];
                if (responseCode == '4014') {
                    console.log("Commission Read Successfull")

                    spCommissionDetails.forEach(element => {
                        this.spCommissionArray.push(element);
                    });

                    this.showUserInfoContainer = true;
                } else if (responseCode == '4015') {
                    this.adminService.popupMessage = "Commission Read Failure.";
                    this.adminService.isShowPopup = true;
                    this.adminService.isWarningPopup = true;
                } else if (responseCode == "9996") {
                    this.adminService.popupMessage = "User is not allowed to perform this action.";
                    this.adminService.isShowPopup = true;
                    this.adminService.isWarningPopup = true;
                } else if (responseCode == "9998") {
                    this.adminService.popupMessage = "Invalid user type.";
                    this.adminService.isShowPopup = true;
                    this.adminService.isWarningPopup = true;
                } else if (responseCode == "9999") {
                    this.adminService.popupMessage = "Your session has expired. Please login again.";
                    this.adminService.isShowPopup = true;
                    this.adminService.isWarningPopup = true;
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

    updateSpCommission(data) {
        //console.log("from updateSpCommission()" + data.userId);

        let currentYear = "" + (new Date()).getFullYear();
        let nextMonth = "" + ((new Date()).getMonth() + 2);
        let year = currentYear;

        if (nextMonth == "13") {//Gopi: It means current month is December.11+2=>13. So, next month should be January.
            nextMonth = "1";
            year = currentYear + 1;
        }

        let isOnline: boolean = navigator.onLine;

        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;

            this.adminService.updateSpCommission(data.userId, nextMonth, year, data.commission).subscribe(res => {
                let responseCode = res.headers.get('responsecode');

                this.adminService.isLoading = false;

                if (responseCode == "4011") {
                    this.getSPCommissionByAdmin();
                    //this.searchUser();
                    this.adminService.popupMessage = "Commission updated successfully.";
                    this.adminService.isSuccessPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "4012") {
                    this.adminService.popupMessage = "Commission update failure.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "4013") {
                    this.adminService.popupMessage = "Same commission exists for the month.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responseCode == "9996") {
                    this.adminService.popupMessage = "User is not allowed to perform this action.";
                    this.adminService.isWarningPopup = true;
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

    showAddNewAdvisorContainer() {
        this.showAddNewAdvisorContainerBoolean = !this.showAddNewAdvisorContainerBoolean;
        this.adminService.isShowPopup = false;
        this.showAddAdvisorErrorMessage = false;
        this.showPasswordErrorMessage = false;
    }

    onSave() {

        let userNamePattern: RegExp = /^[a-zA-Z0-9 _\.-]+$/;

        if (this.addAdvisorForm.controls['name'].value == "" || this.addAdvisorForm.controls['email'].value == "" || this.addAdvisorForm.controls['password'].value == "") {
            this.errorMessage = "All fields are mandatory.";
            this.showAddAdvisorErrorMessage = true;
            this.showEmailErrorMessage = false;
        } else if (!userNamePattern.test(this.addAdvisorForm.controls['name'].value)) {
            this.errorMessage = "Enter valid name";

            this.showAddAdvisorErrorMessage = true;
            this.showEmailErrorMessage = false;
        } else if (this.isThePasswordValid == false) {
            this.showPasswordErrorMessage = true;
            this.passwordErrorMessage = "Enter valid password";
        } else if (!this.isNameValid || !this.isEmailValid) {// || !this.isMobileNoValid) {

        } else {
            this.showAddAdvisorErrorMessage = false;
            this.showEmailErrorMessage = false;
            this.showMobileNumberExistsMessage = false;
            //this.emptyFields();

            let nameText = this.addAdvisorForm.controls['name'].value ? this.addAdvisorForm.controls['name'].value : 0;
            let emailText = this.addAdvisorForm.controls['email'].value ? this.addAdvisorForm.controls['email'].value : 0;
            let mobileNumberText = this.addAdvisorForm.controls['mobileNumber'].value ? '+91' + this.addAdvisorForm.controls['mobileNumber'].value : 0;
            let passwordText = this.addAdvisorForm.controls['password'].value ? this.addAdvisorForm.controls['password'].value : 0;
            let redirectUrl = this.adminService.baseUrl + 'activate-email';


            if (this.disableSaveButton == true) {

            } else {
                // this.disableSaveButton = true;
                // let timer = setTimeout(() => {
                //     this.disableSaveButton = false;
                //     this.emptyFields();
                // }, 3000);
                this.addNewAdvisor(nameText, emailText, mobileNumberText, passwordText, redirectUrl);
            }
        }
    }

    addNewAdvisor(name, email, mobileNumber, password, redirectUrl) {
        let isOnline: boolean = navigator.onLine;

        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;
            this.disableSaveButton = true;
            this.adminService.addNewAdvisor(name, email, mobileNumber, password, redirectUrl).subscribe(res => {

                this.adminService.isLoading = false;
                this.disableSaveButton = false;
                let responsecode = res.headers.get('responsecode');
                if (responsecode == "1011") {

                    this.adminService.popupMessage = "User name exists. Please add enter a different name.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;

                } else if (responsecode == "1021") {

                    this.adminService.popupMessage = "Email ID exists. Please add enter a different email id.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "1031") {

                } else if (responsecode == "1111") {
                    this.adminService.popupMessage = "Advisor created successfully. Activation link has been sent to the advisor's registered email id.";
                    this.adminService.isSuccessPopup = true;
                    this.adminService.isShowPopup = true;
                    this.emptyFields();
                } else if (responsecode == "1112") {
                    this.adminService.popupMessage = "User creation failure.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9996") {//This is not in swagger
                    this.adminService.popupMessage = "User is not allowed to perform this action.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9999") {
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

    activateOrBlockUser(data) {

        let isOnline: boolean = navigator.onLine;

        if (isOnline == false) {
            alert("You are offline. Please check your network.");
        } else {
            this.adminService.isLoading = true;

            this.adminService.deActivateUser(data.userId, data.blockUser, data.comments).subscribe(response => {

                this.adminService.isLoading = false;
                let responsecode = response.headers.get('responsecode');

                // console.log("ResponseCode after calling deActivateUser():" + responsecode);

                if (responsecode == "2603") {

                    this.searchUser();
                } else if (responsecode == "2604") {
                    this.adminService.popupMessage = "User activation/deactivation failure.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9998") {
                    this.adminService.popupMessage = "User is not allowed to perform this action.";
                    this.adminService.isWarningPopup = true;
                    this.adminService.isShowPopup = true;
                } else if (responsecode == "9999") {
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