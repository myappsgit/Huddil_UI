import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MeetupService } from '../provider/meetup.service';
import { AdminService } from '../admin-module/admin-providers/admin.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../partner-signup/passwordValidations';

import { FacebookService } from '../social-authentication/facebook.service';

declare const gapi: any;
declare const FB: any;

@Component({
    selector: 'user-signUp',
    templateUrl: 'sign-up.component.html',
    styleUrls: ['sign-up.component.css']
})

export class UserSignUpComponent {

    public auth2: any;

    form: FormGroup;
    consumerSignupForm: FormGroup;
    OTPform: FormGroup;
    googleUserSubmitprocessStart: boolean;
    isConsumerSignUp: boolean;
    isGoogleSignupMobileNumberpopup: boolean = false;
    showLoading: boolean;
    consumerSignupProcessStart: boolean;
    isAlreadyExist: boolean;
    isVerifyOTP: boolean;
    isConsumerlogin: boolean = true;
    ismobileVerified: boolean;
    formError: any;
    isOTPSendingProcessStart: boolean;
    isDataLoading: boolean;
    isTermsAndCondition: boolean;

    dataAlreadyExistMsg: string = '';
    status: string = '';
    emailStatus: string = '';
    mobileNumberStatus: string = '';
    cookieValue: any;
    googleMobileForm: FormGroup;
    googleMobileFormOTP: FormGroup;
    googleuserdata: any = [];
    facebookUserData: any = [];
    googleMobileErrorMsz: string = '';
    showOTPBoxForGoogleSignUp: boolean;
    useMobileForOTP;
    loginError: boolean;
    otpFormError: boolean;
    passwordFormError: boolean;
    invalidEmailForSignIn: boolean;
    facebookAccessToken: any;

    constructor(public ref: ChangeDetectorRef, public facebookService: FacebookService, public router: Router, public meetupService: MeetupService, public adminService: AdminService, public fb: FormBuilder) {
        this.meetupService.getTermsAndConditionsForSP();
        this.googleMobileForm = this.fb.group({
            mobile: ['']
        });

        this.googleMobileFormOTP = this.fb.group({
            otp: [''
                , Validators.required]
        });

        this.form = this.fb.group({
            username: [''
                , Validators.required],
            password: [''
                , Validators.required],
            remember: ['']
        });

        this.consumerSignupForm = this.fb.group({
            name: [''
                , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(3), Validators.maxLength(45)])],
            email: [''
                , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9._]+[/@]+[a-zA-Z-]+[/.]+[a-zA-Z]+[a-zA-Z]")])],
            mobile: [''],
            password: [''
                , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
            cpassword: [''
                , Validators.required],
            terms: [''
                , Validators.required],
        }, {
                validator: PasswordValidation.MatchPassword // your validation method
            })
        this.OTPform = this.fb.group({
            otpValue: ['', Validators.required]
        })
        this.meetupService.getTermsAndConditionsForConsumer();
    }

    ngOnInit() {

        this.emailIdValidation();
        this.mobileNumberValidation();
    }

    emailIdValidation() {

        this.consumerSignupForm.controls['email'].valueChanges.subscribe(value => {
            let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            if (value.length > 0) {
                if (!emailPattern.test(value)) {
                    this.emailStatus = "Please Enter Valid Email ID";
                } else {
                    this.emailStatus = "";
                    // this.adminService.checkEmailIdAvailability(value);

                    this.meetupService.checkEmailIdAvailability(value).subscribe(response => {
                        let responseCodeForEmailId = response.headers.get('ResponseCode');

                        if (responseCodeForEmailId == '1021') {
                            this.isAlreadyExist = true;
                            this.dataAlreadyExistMsg = 'Email already exist';
                        }
                        else {
                            this.dataAlreadyExistMsg = '';
                        }
                    });

                }
            } else {
                this.emailStatus = "Please Enter Email ID";
            }
        });

    }


    mobileNumberValidation() {
        this.consumerSignupForm.controls['mobile'].valueChanges.subscribe(value => {
            let mobilePattern = /[0-9]/;;

            if (value.length > 0 && value.length <= 10) {
                if (!mobilePattern.test(value)) {
                    this.mobileNumberStatus = "Please Enter Valid Mobile Nmber";

                } else if (value.length < 10) {
                    this.mobileNumberStatus = "Please Enter Valid Mobile Number";

                }
                else {
                    if (value.length == 10) {
                        this.mobileNumberStatus = '';
                        //this.adminService.checkMobileNumberAvailability(value);
                        // this.meetupService.checkMobileNumberAvailability(value).subscribe(result => {
                        //     let responseCodeForMobileNumber = result.headers.get('ResponseCode');

                        //     if (responseCodeForMobileNumber == '1031') {
                        //         this.dataAlreadyExistMsg = "Mobile Number Registered, Use Different One";

                        //     }

                        // })
                    }
                }
            } else if (value.length > 10) {
                this.mobileNumberStatus = "Please enter a valid mobile number";

            }
            else {
                this.mobileNumberStatus = '';

            }

        });

        this.mobileNumberStatus = "";
    }



    //form login
    login() {
        this.invalidEmailForSignIn = false;
        let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.form.controls['username'].value == '' || this.form.controls['password'].value == '') {
            this.loginError = true;
        }
        else if (!emailPattern.test(this.form.controls['username'].value)) {
            this.invalidEmailForSignIn = true;
        }

        else {
            this.invalidEmailForSignIn = false;
            this.loginError = false;
            this.loaderPresent();
            let username = this.form.controls['username'].value;
            username = username.toLowerCase();
            let password = this.form.controls['password'].value;
            let userNameEncoded = btoa(username);
            let passwordEncoded = btoa(password);


            let result =
                this.meetupService.login(userNameEncoded, passwordEncoded).subscribe(res => {

                    // this.loaderDismiss();
                    let responseCode = res.headers.get('ResponseCode');




                    if (responseCode == '1511') {
                        let userType = res.headers.get("userType");
                        let sessionId = res.headers.get("sessionId");
                        let tcpsData = JSON.parse(res.text());

                        sessionStorage.setItem('isLatestTCPS', tcpsData.tcps);

                        if (sessionStorage.getItem('isLatestTCPS') == 'true') {

                            if (userType == '7' || userType == '8') {

                                this.meetupService.isShowTCPSLoginPopUp = true;
                            }
                        }
                        this.meetupService.usertype = userType;
                        switch (userType) {

                            case null:
                                this.form.controls['password'].setErrors({
                                    invalidStatus: 'Invalid Credentials.'
                                });
                                this.loaderDismiss();
                                break;
                            case '5':
                                // this.meetupService.isLoginPopUp = false;
                                this.adminService.isLoggedIn = true;
                                this.adminService.adminSessionId = sessionId;
                                this.meetupService.redirectUrl = 'admin';
                                break;
                            case '6':
                                // this.meetupService.isLoginPopUp = false;
                                this.meetupService.isLoggedIn = true;
                                this.meetupService.redirectUrl = 'advisor';
                                break;
                            case '7':
                                // this.meetupService.isLoginPopUp = false;
                                this.meetupService.isLoggedIn = true;
                                this.meetupService.redirectUrl = 'service-provider';
                                break;
                            case '8':
                                this.meetupService.isLoginPopUp = false;
                                this.meetupService.isLoggedIn = true;
                                this.meetupService.redirectUrl = '';
                                break;
                            default:
                                this.form.controls['password'].setErrors({
                                    invalidStatus: 'User Type not found'
                                });
                                this.meetupService.isLoggedIn = false;
                                break;


                        }
                        if (this.meetupService.isLoggedIn || this.adminService.isLoggedIn) {


                            this.meetupService.sessionId = sessionId;
                            //store in localstorage
                            let userData = {
                                'sessionId': sessionId,
                                'redirectUrl': this.meetupService.redirectUrl,
                                'userType': this.meetupService.usertype,
                                'diaplayName': JSON.parse(res.text()).name
                            }

                            sessionStorage.setItem('currentUser', JSON.stringify(userData));

                            //set consumer data

                            this.meetupService.consumerUserData = JSON.parse(res.text()).name;
                            sessionStorage.setItem('consumerName', JSON.parse(res.text()).name);
                            //set cookie
                            if (this.form.controls['remember'].value) {

                                localStorage.setItem('authCookie', JSON.stringify(userData));
                            }
                            // localStorage.setItem('SessionId', sessionId);
                            // localStorage.setItem('redirectUrl', this.meetupService.redirectUrl);
                            // localStorage.setItem('userType', this.meetupService.usertype);

                            if (this.meetupService.usertype == '7' || this.meetupService.usertype == '6' || this.meetupService.usertype == '5') {
                                this.router.navigate([this.meetupService.redirectUrl]);
                            }

                            else if (this.meetupService.previousUrl != undefined && this.meetupService.previousUrl != '' && this.meetupService.previousUrl != '/login' && this.meetupService.previousUrl != '/') {
                                this.router.navigate([this.meetupService.previousUrl]);
                            }
                            else {
                                this.router.navigate([this.meetupService.redirectUrl]);
                            }


                        }
                    }
                    else if (responseCode == '1512') {
                        this.loaderDismiss();
                        this.form.controls['password'].setErrors({
                            invalidStatus: 'Device limit has reached'
                        });
                    }
                    else if (responseCode == '1513') {

                        this.loaderDismiss();
                        this.form.controls['password'].setErrors({
                            invalidStatus: 'Autherization failure'
                        });
                    }
                    else if (responseCode == '1514') {
                        this.loaderDismiss();
                        this.form.controls['password'].setErrors({
                            invalidStatus: 'Session can not be created'
                        });
                    }
                    else if (responseCode == '1515') {
                        this.loaderDismiss();
                        this.form.controls['password'].setErrors({
                            invalidStatus: 'Account is not yet activated'
                        });
                    }
                    else if (responseCode == '1944') {
                        this.loaderDismiss();
                        this.form.controls['password'].setErrors({
                            invalidStatus: 'Account is not yet activated'
                        });
                    }
                    else {
                        this.loaderDismiss();
                        this.form.controls['password'].setErrors({
                            invalidStatus: 'Unknown response code : ' + responseCode
                        });
                    }

                },
                    (error) => {
                        this.loaderDismiss();
                        if (error.status == 500) {
                            this.form.controls['password'].setErrors({
                                invalidStatus: 'Something went wrong in server.'
                            });

                        } else {
                            this.form.controls['password'].setErrors({
                                invalidStatus: 'Something went wrong.'
                            });
                        }
                    });
        }

    }
    loaderPresent() {
        this.showLoading = true;

    }
    loaderDismiss() {
        this.showLoading = false;

    }

    showConsumerSignUp() {
        this.isConsumerSignUp = true;
        this.isConsumerlogin = false;
    }
    showLoginForm() {
        this.isConsumerlogin = true;
        this.isConsumerSignUp = false;
    }
    showServiceProviderSignUp() {
        this.meetupService.isLoginPopUp = false;
        this.router.navigate(['/service-provider-signup']);
    }
    goToForgottPasswordPage() {
        this.meetupService.isLoginPopUp = false;
        this.router.navigate(['forgot-password']);
    }
    signUpAfterGettingMobileOTP() {
        this.consumerSignupProcessStart = true;
        this.isOTPSendingProcessStart = false;
        this.otpFormError = false;
        let mobileOTP = this.OTPform.controls['otpValue'].value;
        if (mobileOTP == '') {
            this.consumerSignupProcessStart = false;
            this.otpFormError = true;
            this.ref.detectChanges();
        }
        else {
            this.otpFormError = false;
            this.isOTPSendingProcessStart = true;
            let userType = 'consumer';

            let mobileNumber = '%2B91' + this.consumerSignupForm.controls['mobile'].value;

            let redirectUrl = this.meetupService.baseUrl + 'activate-email';
            this.meetupService.verifyByMobileOTP(mobileOTP, mobileNumber, userType, redirectUrl).subscribe(res => {
                this.consumerSignupProcessStart = false;
                this.isOTPSendingProcessStart = false;
                let responseCode = res.headers.get('ResponseCode');

                switch (responseCode) {
                    case '1941':
                        this.meetupService.isLoginPopUp = true;
                        this.isVerifyOTP = false;
                        this.ismobileVerified = true;
                        this.status = "Mobile number verifed successfully. Please check your E-mail for account activation."
                        this.router.navigate(['']);
                        break;
                    case '1942':

                        this.consumerSignupProcessStart = false;
                        this.ismobileVerified = true;
                        this.status = 'failure';
                        this.ref.detectChanges();
                        break;
                }
            })
        }
    }




    signup() {
        if (this.consumerSignupForm.controls['name'].value == '' || this.consumerSignupForm.controls['email'].value == '' ||
            this.consumerSignupForm.controls['password'].value == '' ||
            this.consumerSignupForm.controls['cpassword'].value == '' || this.consumerSignupForm.controls['terms'].value != true) {
            this.formError = true;
        }
        else if (this.consumerSignupForm.controls['password'].value.length < 6 || this.consumerSignupForm.controls['password'].value.length > 15) {
            this.passwordFormError = true;
        }
        else if (this.consumerSignupForm.valid && !this.dataAlreadyExistMsg) {
            this.passwordFormError = false;
            this.isDataLoading = true;
            this.isConsumerSignUp = false;
            this.isConsumerlogin = false;
            let redirectUrl = this.meetupService.baseUrl + 'activate-email';
            this.consumerSignupProcessStart = true;
            this.formError = false;
            this.isAlreadyExist = false;
            let mobile = this.consumerSignupForm.controls['mobile'].value != '' ? '+91' + this.consumerSignupForm.controls['mobile'].value : '';
            this.meetupService.signup(this.consumerSignupForm.controls['name'].value, this.consumerSignupForm.controls['email'].value,
                mobile, this.consumerSignupForm.controls['password'].value, redirectUrl).subscribe(response => {

                    let responseCode = response.headers.get('ResponseCode');

                    switch (responseCode) {
                        case '1111':
                            this.isDataLoading = false;
                            this.consumerSignupProcessStart = false;
                            this.ismobileVerified = true;
                            this.status = "Registration successfull. Please check your E-mail for account activation."
                            this.router.navigate(['']);
                            break;
                        case '1021':
                            this.isConsumerSignUp = true;
                            this.isDataLoading = false;
                            this.isVerifyOTP = false;
                            this.consumerSignupProcessStart = false;
                            this.dataAlreadyExistMsg = 'Email already exist.';
                            this.isAlreadyExist = true;
                            break;
                        case '1031':
                            this.isConsumerSignUp = true;
                            this.isDataLoading = false;
                            this.isVerifyOTP = false;
                            this.consumerSignupProcessStart = false;
                            this.dataAlreadyExistMsg = 'Mobile no. already exist';
                            this.isAlreadyExist = true;
                            break;
                        case '1112':
                            this.isConsumerSignUp = true;
                            this.isDataLoading = false;
                            this.isVerifyOTP = false;
                            this.consumerSignupProcessStart = false;
                            this.dataAlreadyExistMsg = 'Failure';
                            this.isAlreadyExist = true;
                            break;
                        case '9999':
                            this.isConsumerSignUp = true;
                            this.isDataLoading = false;
                            this.isVerifyOTP = false;
                            this.consumerSignupProcessStart = false;
                            this.dataAlreadyExistMsg = 'Invalid data Passed';
                            this.isAlreadyExist = true;

                            break;
                    }

                });

        }
    }
    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }

    closeTermsAndConditionsPopUp() {
        this.isTermsAndCondition = false;
        this.isConsumerSignUp = true;
        this.isConsumerlogin = false;
    }
    showTermsAndConditionsBox() {
        this.meetupService.isShowConsumerTCPSPopup = true;


        // this.isConsumerSignUp = false;
        // this.isConsumerlogin = false;
        // this.isTermsAndCondition = true;

    }

    public signupWithGoogle() {

        gapi.load('auth2', () => {
            var auth2 = gapi.auth2.init({
                client_id: this.meetupService.googleSecretKey,
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            })
            gapi.auth2.getAuthInstance().signIn().then(googleUser => {
                let profile = googleUser.getBasicProfile();





                this.googleuserdata['token'] = googleUser.getAuthResponse().access_token;
                this.googleuserdata['name'] = profile.getName();
                this.googleuserdata['email'] = profile.getEmail();
                this.googleSignUp();
                this.ref.detectChanges();

            })


        });

    }
    facebookSignUp() {

        let name = this.facebookUserData['name'];
        let email = this.facebookUserData['email'];
        let mobile = '';
        let token = this.facebookAccessToken;
        let redirectUrl = this.meetupService.baseUrl + 'activate-email';
        this.meetupService.consumerSignupWithFacebook(name, email, mobile, token, redirectUrl).subscribe(res => {

            let responseCode = res.headers.get('ResponseCode');
            let userType = res.headers.get("userType");
            let sessionId = res.headers.get("sessionId")
            this.googleUserSubmitprocessStart = false;
            switch (responseCode) {
                case '1021':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Email ID exists';
                    this.meetupService.isWarningPopup = true;

                    break;
                case '1011':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Email Username exists';
                    this.meetupService.isWarningPopup = true;
                    break;
                case '1031':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Mobile No. exists';
                    this.meetupService.isWarningPopup = true;
                    break;
                case '1111':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Registration Successfull. Please login.';
                    break;
                case '1112':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Create User Failure';
                    this.meetupService.isWarningPopup = true;

                    break;
                case '1511':
                    this.meetupService.isLoggedIn = true;
                    this.meetupService.redirectUrl = '';
                    this.meetupService.sessionId = sessionId;
                    this.meetupService.usertype = userType;
                    this.meetupService.isLoginPopUp = false;
                    //store in localstorage
                    let userData = {
                        'sessionId': sessionId,
                        'redirectUrl': this.meetupService.redirectUrl,
                        'userType': this.meetupService.usertype,
                        'diaplayName': JSON.parse(res.text()).name
                    }
                    sessionStorage.setItem('currentUser', JSON.stringify(userData));

                    //set consumer data

                    this.meetupService.consumerUserData = JSON.parse(res.text()).name;
                    //set cookie
                    if (this.form.controls['remember'].value) {

                        localStorage.setItem('authCookie', JSON.stringify(userData));
                    }


                    if (this.meetupService.usertype == '7' || this.meetupService.usertype == '6' || this.meetupService.usertype == '5') {
                        this.router.navigate([this.meetupService.redirectUrl]);
                    }

                    else if (this.meetupService.previousUrl != undefined && this.meetupService.previousUrl != '' && this.meetupService.previousUrl != '/login' && this.meetupService.previousUrl != '/') {
                        this.router.navigate([this.meetupService.previousUrl]);
                    }
                    else {
                        this.router.navigate([this.meetupService.redirectUrl]);
                    }

                    break;

                case '1513':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Autherization failure';
                    this.meetupService.isWarningPopup = true;

                    break;
            }
        }, (error) => {
            this.googleUserSubmitprocessStart = false;
            if (error.status == 500) {
                this.meetupService.isLoginPopUp = false;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = 'Something went wrong in server';
                this.meetupService.isWarningPopup = true;

            } else {
                this.meetupService.isLoginPopUp = false;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = 'Internal Server Error';
                this.meetupService.isWarningPopup = true;

            }
        });
    }
    googleSignUp() {
        this.googleMobileErrorMsz = '';
        this.googleUserSubmitprocessStart = true;
        let name = String(this.googleuserdata['name'].split(' ', 1).slice(0, 44));
        let token = this.googleuserdata['token'];
        let email = this.googleuserdata['email'];
        let mobile = '';
        let redirectUrl = this.meetupService.baseUrl + 'activate-email';
        //this.useMobileForOTP = '%2B91' + this.googleMobileForm.controls['mobile'].value;

        this.meetupService.consumerSignupWithGoogle(name, email, mobile, token, redirectUrl).subscribe(res => {
            let responseCode = res.headers.get('ResponseCode');
            let status = res.headers.get('status');
            let sessionId = res.headers.get("sessionId");
            let userType = res.headers.get("userType");
            if (status != undefined && status == '-1') {
                this.googleUserSubmitprocessStart = false;
                this.showOTPBoxForGoogleSignUp = true;
                this.ref.detectChanges();
            }
            this.googleUserSubmitprocessStart = false;

            switch (responseCode) {
                case '1021':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Email ID exists';
                    this.meetupService.isWarningPopup = true;
                    // this.googleMobileErrorMsz = 'Email ID exists';
                    break;
                case '1011':
                    this.googleMobileErrorMsz = 'Username exists';
                    break;
                case '1031':
                    if (status != '-1') {
                        this.googleMobileErrorMsz = 'Mobile no. exists';
                    }
                    break;
                case '1111':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Registration Successfull. Please login';

                    // alert("Registration Successfull. Please check your E-mail for account Activation.");
                    //this.status = "Mobile number Verifed Successfully.. Please check your E-mail for account Activation."
                    // this.meetupService.isLoginPopUp = false;
                    // this.router.navigate(['']);
                    // this.showOTPBoxForGoogleSignUp = true;
                    // this.ref.detectChanges();
                    break;
                case '1112':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Create User Failure';
                    this.meetupService.isWarningPopup = true;
                    //this.googleMobileErrorMsz = 'Create User Failure';
                    break;
                case '1511':
                    this.meetupService.isLoggedIn = true;
                    this.meetupService.redirectUrl = '';
                    this.meetupService.sessionId = sessionId;
                    this.meetupService.usertype = userType;
                    this.meetupService.isLoginPopUp = false;
                    //store in localstorage
                    let userData = {
                        'sessionId': sessionId,
                        'redirectUrl': this.meetupService.redirectUrl,
                        'userType': this.meetupService.usertype,
                        'diaplayName': JSON.parse(res.text()).name
                    }
                    sessionStorage.setItem('currentUser', JSON.stringify(userData));

                    //set consumer data

                    this.meetupService.consumerUserData = JSON.parse(res.text()).name;
                    //set cookie
                    if (this.form.controls['remember'].value) {

                        localStorage.setItem('authCookie', JSON.stringify(userData));
                    }


                    if (this.meetupService.usertype == '7' || this.meetupService.usertype == '6' || this.meetupService.usertype == '5') {
                        this.router.navigate([this.meetupService.redirectUrl]);
                    }

                    else if (this.meetupService.previousUrl != undefined && this.meetupService.previousUrl != '' && this.meetupService.previousUrl != '/login' && this.meetupService.previousUrl != '/') {
                        this.router.navigate([this.meetupService.previousUrl]);
                    }
                    else {
                        this.router.navigate([this.meetupService.redirectUrl]);
                    }
                    break;

                case '1513':
                    this.meetupService.isLoginPopUp = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Autherization failure';
                    this.meetupService.isWarningPopup = true;
                    //this.googleMobileErrorMsz = 'Autherization failure';
                    break;
            }
        }, (error) => {
            this.googleUserSubmitprocessStart = false;
            if (error.status == 500) {
                this.meetupService.isLoginPopUp = false;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = 'Something went wrong in server';
                this.meetupService.isWarningPopup = true;
                //this.googleMobileErrorMsz = 'Something went wrong in server';
            } else {
                this.meetupService.isLoginPopUp = false;
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = 'Internal Server Error';
                this.meetupService.isWarningPopup = true;
                //this.googleMobileErrorMsz = 'Internal Server Error';
            }
        });
    }
    loginWithGoogle() {
        alert('under process');
    }
    loginWithFacebook() {
        this.facebookService.init();
        FB.init({
            appId: this.meetupService.facebookAppKey,
            xfbml: true,
            version: 'v2.5'
        })
        FB.login(loginResponse => {
            this.facebookAccessToken = loginResponse.authResponse.accessToken;

            this.facebookService.fetchInformation(this.facebookAccessToken).subscribe(res => {
                this.facebookUserData['email'] = res.email;
                this.facebookUserData['name'] = res.name;
                this.facebookLogin();

            });

        }, { scope: 'email,public_profile', return_scopes: true })
    }
    facebookLogin() {
        let email = this.facebookUserData['email'];
        this.meetupService.consumerSignInWithFacebook(email, this.facebookAccessToken, 'huddil').subscribe(res => {
            let responseCode = res.headers.get('ResponseCode');
            this.meetupService.closeLoginPopup();
            this.meetupService.isLoginPopUp = true;

            switch (responseCode) {

                case '1511':

                    let displayName = JSON.parse(res.text()).name
                    this.meetupService.sessionId = res.headers.get('sessionId');
                    this.meetupService.isLoggedIn = true;
                    this.meetupService.redirectUrl = '';
                    this.meetupService.usertype = res.headers.get('userType');
                    this.meetupService.isUserLoggedInWithGoogle = true;


                    //store in localstorage
                    let userData = {
                        'sessionId': this.meetupService.sessionId,
                        'redirectUrl': this.meetupService.redirectUrl,
                        'userType': this.meetupService.usertype,
                        'diaplayName': displayName
                    }


                    sessionStorage.setItem('currentUser', JSON.stringify(userData));
                    //set consumer data

                    this.meetupService.consumerUserData = JSON.parse(res.text()).name;
                    if (this.meetupService.previousUrl != undefined && this.meetupService.previousUrl != '' && this.meetupService.previousUrl != '/login' && this.meetupService.previousUrl != '/') {
                        this.router.navigate([this.meetupService.previousUrl]);
                    }
                    else {
                        this.router.navigate([this.meetupService.redirectUrl]);
                    }
                    break;
                case '1512':
                    alert('Device limit has reached');
                    break;
                case '1513':
                    alert('Autherization failure');

                    break;
                case '1514':
                    alert('Session cannot be created');
                    break;
                case '1515':
                    alert('Account is not yet activated');
                    break;
                default:
                    alert('response');
                    break;
            }
        });
    }
    signupWithFacebook() {
        this.facebookService.init();
        FB.init({
            appId: this.meetupService.facebookAppKey,
            xfbml: true,
            version: 'v2.5'
        })
        FB.login(loginResponse => {
            this.facebookAccessToken = loginResponse.authResponse.accessToken;

            this.facebookService.fetchInformation(this.facebookAccessToken).subscribe(res => {
                this.facebookUserData['email'] = res.email;
                this.facebookUserData['name'] = res.name;
                this.facebookSignUp();

            });

        }, { scope: 'email,public_profile', return_scopes: true })
    }
    public signinWithGoogle() {
        var context = this;
        gapi.load('auth2', () => {
            var auth2 = gapi.auth2.init({
                client_id: this.meetupService.googleSecretKey,
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            })
            gapi.auth2.getAuthInstance().signIn().then(googleUser => {
                let profile = googleUser.getBasicProfile();

                context.googleuserdata['token'] = googleUser.getAuthResponse().access_token;
                context.googleuserdata['name'] = profile.getName();
                context.googleuserdata['email'] = profile.getEmail();

                context.googleSignInAPI(profile.getEmail(), googleUser.getAuthResponse().access_token)

            })


        });

    }
    googleSignInAPI(email, token) {
        this.meetupService.consumerSignInWithGoogle(email, token, 'huddil').subscribe(res => {
            let responseCode = res.headers.get('ResponseCode');
            this.meetupService.closeLoginPopup();
            this.meetupService.isLoginPopUp = false;

            switch (responseCode) {

                case '1511':

                    let displayName = JSON.parse(res.text()).name
                    this.meetupService.sessionId = res.headers.get('sessionId');
                    this.meetupService.isLoggedIn = true;
                    this.meetupService.redirectUrl = '';
                    this.meetupService.usertype = res.headers.get('userType');
                    this.meetupService.isUserLoggedInWithGoogle = true;


                    //store in localstorage
                    let userData = {
                        'sessionId': this.meetupService.sessionId,
                        'redirectUrl': this.meetupService.redirectUrl,
                        'userType': this.meetupService.usertype,
                        'diaplayName': displayName
                    }


                    sessionStorage.setItem('currentUser', JSON.stringify(userData));
                    //set consumer data

                    this.meetupService.consumerUserData = JSON.parse(res.text()).name;
                    if (this.meetupService.previousUrl != undefined && this.meetupService.previousUrl != '' && this.meetupService.previousUrl != '/login' && this.meetupService.previousUrl != '/') {
                        this.router.navigate([this.meetupService.previousUrl]);
                    }
                    else {
                        this.router.navigate([this.meetupService.redirectUrl]);
                    }
                    break;
                case '1512':
                    alert('Device limit has reached');
                    break;
                case '1513':
                    alert('Autherization failure');

                    break;
                case '1514':
                    alert('Session cannot be created');
                    break;
                case '1515':
                    alert('Account is not yet activated');
                    break;
                default:
                    alert('response');
                    break;
            }
        });
    }
    signUpCompleted(displayName) {

        if (this.meetupService.isLoggedIn) {


            this.ref.detectChanges();
            //store in localstorage
            let userData = {
                'sessionId': this.meetupService.sessionId,
                'redirectUrl': this.meetupService.redirectUrl,
                'userType': this.meetupService.usertype,
                'diaplayName': displayName
            }
            sessionStorage.setItem('currentUser', JSON.stringify(userData));

            if (this.meetupService.previousUrl != undefined && this.meetupService.previousUrl != '' && this.meetupService.previousUrl != '/login' && this.meetupService.previousUrl != '/') {
                this.router.navigate([this.meetupService.previousUrl]);
            }
            else {
                this.router.navigate([this.meetupService.redirectUrl]);
            }

        }
    }
    googleSignUpOTPVerify() {

        this.googleMobileErrorMsz = '';
        let otpvalue = this.googleMobileFormOTP.controls['otp'].value
        let mobilenumber = this.useMobileForOTP;
        let usertype = 'consumer';
        let redirectUrl = this.meetupService.baseUrl + 'activate-email';

        if (otpvalue == '') {
            this.googleMobileErrorMsz = 'Enter OTP';
        }
        else {
            this.googleUserSubmitprocessStart = true;
            this.meetupService.verifyByMobileOTP(otpvalue, mobilenumber, usertype, redirectUrl).subscribe(res => {
                this.googleUserSubmitprocessStart = false;
                this.showOTPBoxForGoogleSignUp = false;
                this.googleMobileErrorMsz = '';
                let responseCode = res.headers.get('ResponseCode');

                switch (responseCode) {
                    case '1941':
                        alert("Mobile number Verifed Successfully.. Please check your E-mail for account Activation.");
                        //this.status = "Mobile number Verifed Successfully.. Please check your E-mail for account Activation."
                        this.router.navigate(['']);
                        break;
                    case '1942':
                        alert('failure');
                        break;
                }
            });
        }
    }
    closeSPTCPSPopup() {
        this.meetupService.isShowTCPSLoginPopUp = false;

    }
}