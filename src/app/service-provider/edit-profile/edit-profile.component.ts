import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MeetupService } from '../../provider/meetup.service';

import { Router } from '@angular/router';
declare var jQuery: any;

@Component({
    selector: 'edit-profile',
    templateUrl: 'edit-profile.component.html',
    styleUrls: ['edit-profile.component.css']
})

export class EditProfileComponent {

    editProfileForm: FormGroup;

    isChangeEmailPopup: boolean;


    isUserDetailsReady: boolean;

    isLoading: boolean;

    mobileNumberChanged: boolean;
    isMobileVerfied: boolean;
    userDetails: any;
    mobile: any;
    errorMsg: string = '';
    isSessionExpired: boolean;
    mobileErrorMsz: string = '';
    isOTPFieldContainer: boolean;
    updatingMobileNumber: boolean;
    nameErrorMsg: string = '';
    username: any;


    constructor(public fb: FormBuilder, public meetupService: MeetupService, public router: Router) {
        this.editProfileForm = fb.group({
            name: [''
                , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(3), Validators.maxLength(45)])],
            email: ['', Validators.required],
            mobileNumber: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])]
        })
        this.getUserDetails();
        this.mobileNumberValueChanges();
        this.nameInitialize();

    }
    mobileNumberValueChanges() {
        this.editProfileForm.controls['mobileNumber'].valueChanges.subscribe(value => {
            this.mobileErrorMsz = '';
            this.mobileNumberChanged = false;

            if (value.length == 10) {
                if (value != this.mobile) {
                    this.mobileNumberChanged = true;
                }
                else {
                    this.mobileNumberChanged = false;
                }
            }
            else {
                this.mobileErrorMsz = 'Enter valid mobile number';
            }
        })
        {

        }
    }
    getUserDetails() {
        this.meetupService.getUserDetails().subscribe(response => {
            this.userDetails = response;
            let nameValue = this.userDetails.addressingName;
            let emailId = this.userDetails.emailId;
            this.mobile = this.userDetails.mobileNo.slice(3);
            this.username = this.userDetails.addressingName;
            if (this.userDetails.isActive == 0) {
                this.isMobileVerfied = false;
            }
            else if (this.userDetails.isActive == 1) {
                this.isMobileVerfied = true;
            }
            sessionStorage.setItem('spName', nameValue);
            this.meetupService.consumerUserData = nameValue;
            this.editProfileForm.controls['name'].setValue(nameValue);
            this.editProfileForm.controls['mobileNumber'].setValue(this.mobile);
            this.editProfileForm.controls['email'].setValue(emailId);
            this.editProfileForm.controls['name'].valueChanges;
            this.editProfileForm.controls['email'].valueChanges;
            this.editProfileForm.controls['mobileNumber'].valueChanges;
            this.isUserDetailsReady = true;

        });
    }
    showchangeEmailPopUp() {
        this.isChangeEmailPopup = true;
    }
    closePopUp() {
        this.isChangeEmailPopup = false;
    }

    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
    sendOTP() {
        this.errorMsg = '';
        this.editProfileForm.controls['mobileNumber'].disable();

        this.isLoading = true;
        let mobileNumber = '%2B91' + this.editProfileForm.controls['mobileNumber'].value;
        this.meetupService.sendOTPToMobileNumberForEditProfile(mobileNumber).subscribe(res => {
            let responseCode = res.headers.get('ResponseCode');
            this.isLoading = false;
            switch (responseCode) {
                case '1901':
                    this.isOTPFieldContainer = true;

                    break;
                case '1032':
                    this.errorMsg = 'Failure';
                    break;
                case '9999':
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                    this.isSessionExpired = true;
                    this.meetupService.isInvalidSessionPopupDisplayed = true;
                    break;
                default:
                    this.errorMsg = 'Unknown error code' + responseCode;
                    break;
            }

        },
            (error) => {

                if (error.status == 500) {
                    this.errorMsg = 'Internal server error';


                } else {
                    this.errorMsg = 'Something went wrong in server.';

                }
            })

    }
    verifyMobileNumberThroughOTP() {
        if (!this.updatingMobileNumber) {
            this.updatingMobileNumber = true;
            let newMobileNumber = this.editProfileForm.controls['mobileNumber'].value;
            let otp = jQuery('#mobileOtp').val();

            if (newMobileNumber == '' || otp == '') {
                this.errorMsg = 'Enter required fields';

            }
            else {
                this.errorMsg = '';
                this.meetupService.updateMobileNumber('%2B91' + newMobileNumber, otp).subscribe(res => {
                    let responseCode = res.headers.get('ResponseCode');
                    this.updatingMobileNumber = false;
                    switch (responseCode) {
                        case '1033':
                            this.isOTPFieldContainer = false;
                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.editProfileForm.controls['mobileNumber'].enable();
                            this.meetupService.popupMessage = 'Mobile number updated successfully';

                            this.getUserDetails();
                            break;
                        case '1034':

                            this.errorMsg = 'There is some technical problem. Please contact administrator.'
                            break;
                        case '1031':
                            this.editProfileForm.controls['mobileNumber'].enable();
                            this.errorMsg = 'Mobile number already exists in database.'
                            break;
                        case '1926':
                            this.editProfileForm.controls['mobileNumber'].enable();
                            this.errorMsg = 'Invalid OTP'
                            break;
                        case '9999':
                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                            this.isSessionExpired = true;
                            this.meetupService.isInvalidSessionPopupDisplayed = true;
                            break;
                        default:
                            this.errorMsg = 'Unknown error code' + responseCode;
                            break;
                    }

                },
                    (error) => {

                        if (error.status == 500) {
                            this.errorMsg = 'Internal server error';


                        } else {
                            this.errorMsg = 'Something went wrong in server.';

                        }
                    })
            }
        }
    }
    nameInitialize() {
        this.editProfileForm.controls['name'].valueChanges.subscribe(value => {

            if (value.length > 0) {
                this.nameErrorMsg = '';
            }
        });
    }
    updateUserProfile() {
        let name = this.editProfileForm.controls['name'].value.replace(/\s+/, "");

        if (name.length < 3 || name.length > 45) {
            this.nameErrorMsg = 'Please enter valid name.';
        } else if (name != this.userDetails.addressingName && this.editProfileForm.controls['name'].valid) {
            let addressingName = this.editProfileForm.controls['name'].value;
            let mobileNumber = this.mobile;
            let userType = 'consumer';
            let email = this.editProfileForm.controls['email'].value;
            this.meetupService.updateDetails(addressingName, email, userType).subscribe(res => {
                let responseCode = res.headers.get('ResponseCode');

                switch (responseCode) {
                    case '1311':
                        this.meetupService.isShowPopup = true;
                        // this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'User updated successfully';
                        this.getUserDetails();
                        break;
                    case '1312':
                        this.errorMsg = 'There is some technical problem. Please contact administrator.'
                        break;
                }

            },
                (error) => {

                    if (error.status == 500) {
                        this.errorMsg = 'Internal server error';


                    } else {
                        this.errorMsg = 'Something went wrong in server.';

                    }
                })
        }
    }
    closePopup(type) {
        if (type == "1") {
            this.meetupService.isShowPopup = false;
            this.meetupService.forceLogoutWithoutSessionId();
            this.router.navigate(['']);
        }
        else if (type == "0") {
            this.meetupService.isShowPopup = false;

        }

    }
}
