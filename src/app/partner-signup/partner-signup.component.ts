import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PasswordValidation } from './passwordValidations';
import { MeetupService } from '../provider/meetup.service';
declare const gapi: any;

@Component({
  selector: 'service-provider-signup',
  templateUrl: 'partner-signup.component.html',
  styleUrls: ['partner-signup.component.css']
})
export class ServiceProviderSignUpComponent {

  serviceProviderForm: FormGroup;

  showLoading: boolean;
  isLoginFormDisplay: boolean = true;
  isSignUpFormDisplay: boolean;
  isBusinessSignUpFormDisplay: boolean;
  isVerifyOTP: boolean;
  consumerSignupProcessStart: boolean;
  isAlreadyExist: boolean;
  isShowPopup: boolean;
  isSPDetailsSubmit: boolean = true;
  isOTPSendingProcessStart: boolean;
  ismobileVerified: boolean;
  isTermsAndCondition: boolean;
  isSubmitDetails: boolean = true;
  isDataLoading: boolean = false;
  passwordFormError: boolean;

  formError: any;
  statesData: any;

  dataAlreadyExistMsg: string = '';
  popupMessage: string = '';
  emailStatus: string = '';
  mobileNumberStatus: string = '';
  googleMobileErrorMsz: string = '';
  googleUserSubmitprocessStart: boolean;
  googleuserdata: any = [];
  isGoogleSignupMobileNumberpopup: boolean;
  simpleSignUpOtpProcessForm: FormGroup;
  numberForOTPVerification;
  otpError: boolean;

  googleMobileForm: FormGroup;
  constructor(public changeDetectorRef: ChangeDetectorRef, fb: FormBuilder, public router: Router, public meetupService: MeetupService) {
    this.googleMobileForm = fb.group({
      serviceProvidermobile: ['', Validators.required],
      website: ['', Validators.required],
      address: ['', Validators.required],
      pincode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required]

    });
    this.simpleSignUpOtpProcessForm = fb.group({
      otpValue: ['', Validators.required]
    });

    this.serviceProviderForm = fb.group({
      ownerName: [''
        , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(3), Validators.maxLength(45)])],
      serviceProviderEmailId: [''
        , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9._]+[/@]+[a-zA-Z0-9-]+[/.]+[a-zA-Z]+[a-zA-Z]")])],
      serviceProvidermobile: [''],
      state: [''
        , Validators.required],
      website: [''
        , Validators.compose([Validators.required, Validators.pattern("^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$")])],
      address: [''
        , Validators.required],
      city: [''
        , Validators.required],
      pincode: [''
        , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
      country: ['India'
        , Validators.required],
      password: [''
        , Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      cpassword: [''
        , Validators.required],
      terms: [''
        , Validators.required]
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      })

    this.serviceProviderForm.controls['serviceProviderEmailId'].valueChanges.subscribe(res => {
      this.serviceProviderForm.controls['serviceProviderEmailId']
    });

    this.meetupService.getState().subscribe(res => {
      this.statesData = res;
      this.statesData.shift();
    });
    this.meetupService.getTermsAndConditionsForSP();
  }
  ngOnInit() {
    this.serviceProviderForm.controls['serviceProviderEmailId'].valueChanges.subscribe(value => {

      let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      if (value.length > 0) {

        if (!emailPattern.test(value)) {
          this.emailStatus = "Please enter valid email id";
        } else {
          this.emailStatus = "";
          this.meetupService.checkEmailIdAvailability(value);
        }
      } else {
        this.emailStatus = "Please enter email id";
      }

    });
    this.serviceProviderForm.controls['serviceProvidermobile'].valueChanges.subscribe(value => {
      let mobilePattern = /[0-9]/;;

      if (value.length > 0 && value.length <= 10) {
        if (!mobilePattern.test(value)) {
          this.mobileNumberStatus = "Please enter valid mobile number";

        } else if (value.length < 10) {
          this.mobileNumberStatus = "Please enter valid mobile number";

        }
        else {
          if (value.length == 10) {
            this.mobileNumberStatus = "";
            // this.meetupService.checkMobileNumberAvailability(value);
          }
          this.mobileNumberStatus = "";
        }
      } else if (value.length > 10) {
        this.mobileNumberStatus = "Please enter a valid mobile number";

      }
      else {
        this.mobileNumberStatus = "";

      }

    });
    this.googleMobileForm.controls['serviceProvidermobile'].valueChanges.subscribe(value => {
      let mobilePattern = /[0-9]/;

      if (value.length > 0 && value.length <= 10) {
        if (!mobilePattern.test(value)) {
          this.mobileNumberStatus = "Please enter valid mobile number";

        } else if (value.length < 10) {
          this.mobileNumberStatus = "Please enter valid mobile number";

        }
        else {
          if (value.length == 10) {
            this.meetupService.checkMobileNumberAvailability(value);
          }
          this.mobileNumberStatus = "";
        }
      } else if (value.length > 10) {
        this.mobileNumberStatus = "Please enter a valid mobile number";

      }
      else {
        this.mobileNumberStatus = "Please enter mobile number";

      }

    });
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  serviceProviderSignup() {

    if (this.serviceProviderForm.controls['ownerName'].value == '' || this.serviceProviderForm.controls['serviceProviderEmailId'].value == '' ||
      this.serviceProviderForm.controls['state'].value == '' || this.serviceProviderForm.controls['city'].value == '' || this.serviceProviderForm.controls['pincode'].value == '' ||
      this.serviceProviderForm.controls['country'].value == '' || this.serviceProviderForm.controls['password'].value == '' ||
      this.serviceProviderForm.controls['cpassword'].value == '' || this.serviceProviderForm.controls['terms'].value != true || this.mobileNumberStatus != '') {
      this.formError = true;

    }
    else if (this.serviceProviderForm.controls['password'].value.length < 6 || this.serviceProviderForm.controls['password'].value.length > 15) {

      this.passwordFormError = true;
    }
    else if (this.serviceProviderForm.valid) {

      this.passwordFormError = false;
      this.isDataLoading = true;
      this.isSubmitDetails = false
      this.isSPDetailsSubmit = false;
      let redirectUrl = this.meetupService.baseUrl + 'activate-email';
      this.formError = false;
      this.numberForOTPVerification = this.serviceProviderForm.controls['serviceProvidermobile'].value;
      this.isAlreadyExist = false;
      let mobile = this.serviceProviderForm.controls['serviceProvidermobile'].value != '' ? '+91' + this.serviceProviderForm.controls['serviceProvidermobile'].value : '';
      this.meetupService.signupForSP(this.serviceProviderForm.controls['ownerName'].value,
        this.serviceProviderForm.controls['serviceProviderEmailId'].value, mobile,
        this.serviceProviderForm.controls['website'].value, this.serviceProviderForm.controls['address'].value
        , this.serviceProviderForm.controls['state'].value, this.serviceProviderForm.controls['city'].value, this.serviceProviderForm.controls['pincode'].value,
        this.serviceProviderForm.controls['country'].value, this.serviceProviderForm.controls['password'].value, redirectUrl).subscribe(response => {
          this.isDataLoading = false;
          let responseCode = response.headers.get('ResponseCode');

          switch (responseCode) {
            case '1111':
              this.dataAlreadyExistMsg = '';
              this.isAlreadyExist = false;
              this.ismobileVerified = true;
              this.consumerSignupProcessStart = false;
              //this.isVerifyOTP = true;
              break;
            case '1021':
              this.isSPDetailsSubmit = true;
              this.isSubmitDetails = true;
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Email id already exist.';
              this.isAlreadyExist = true;
              break;
            case '1031':
              this.isSPDetailsSubmit = true;
              this.isSubmitDetails = true;
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Mobile no. already exist';
              this.isAlreadyExist = true;
              break;
            case '1112':
              this.isSPDetailsSubmit = true;
              this.isSubmitDetails = true;
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Failure';
              this.isAlreadyExist = true;

              break;
            case '9999':
              this.isSPDetailsSubmit = true;
              this.isSubmitDetails = true;
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Invalid data passed';
              this.isAlreadyExist = true;
              break;
          }

        });
    }
    else {
      //alert('nothing happen');
    }
  }
  signUpAfterGettingMobileOTP() {
    this.dataAlreadyExistMsg = '';
    let mobileOTP = this.simpleSignUpOtpProcessForm.controls['otpValue'].value;

    if (mobileOTP == '') {
      this.otpError = true;
    }
    else {

      this.otpError = false;
      this.dataAlreadyExistMsg = '';
      this.isOTPSendingProcessStart = true;
      this.isSubmitDetails = false;
      let userType = 'service provider';

      let mobileNumber = '%2B91' + this.numberForOTPVerification;
      let redirectUrl = this.meetupService.baseUrl + 'activate-email';
      this.meetupService.verifyByMobileOTP(mobileOTP, mobileNumber, userType, redirectUrl).subscribe(res => {
        this.isOTPSendingProcessStart = false;
        let responseCode = res.headers.get('ResponseCode');

        switch (responseCode) {
          case '1941':
            this.isVerifyOTP = false;
            this.ismobileVerified = true;
            break;
          case '1942':
            this.dataAlreadyExistMsg = 'Failure';
            break;
        }
      })
    }
  }


  showLoginForm() {
    this.meetupService.isLoginPopUp = true;
  }

  closeTermsAndConditionsPopUp() {
    this.meetupService.isShowSPTCPSPopup = true;
    this.isTermsAndCondition = false;
    this.isSPDetailsSubmit = true;
    this.isVerifyOTP = false;
    this.ismobileVerified = false
    this.isSubmitDetails = true;
  }
  showTermsAndConditionsBox() {
    this.meetupService.isShowSPTCPSPopup = true;
    // this.isTermsAndCondition = true;
    // this.isSPDetailsSubmit = false;
    // this.isVerifyOTP = false;
    // this.ismobileVerified = false
    // this.isSubmitDetails = false;

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
        this.isGoogleSignupMobileNumberpopup = true;
        this.googleuserdata['token'] = googleUser.getAuthResponse().access_token;
        this.googleuserdata['name'] = profile.getName();
        this.googleuserdata['email'] = profile.getEmail();

        this.changeDetectorRef.detectChanges();



      })


    });

  }

  googleSignUp() {
    if (!this.googleMobileForm.valid) {

      this.googleMobileErrorMsz = 'Fill all fields';

      this.changeDetectorRef.detectChanges();
    }
    else {
      this.googleMobileErrorMsz = '';
      this.googleUserSubmitprocessStart = true;
      let name = String(this.googleuserdata['name'].split(' ', 1).slice(0, 14));
      let token = this.googleuserdata['token'];
      let email = this.googleuserdata['email'];
      let mobile = '+91' + this.googleMobileForm.controls['serviceProvidermobile'].value;
      let redirectUrl = this.meetupService.baseUrl + 'activate-email';
      let website = this.googleMobileForm.controls['website'].value;
      let address = this.googleMobileForm.controls['address'].value;
      let state = this.googleMobileForm.controls['state'].value;
      let city = this.googleMobileForm.controls['city'].value;
      let pincode = this.googleMobileForm.controls['pincode'].value;
      let country = this.googleMobileForm.controls['country'].value;

      this.numberForOTPVerification = this.googleMobileForm.controls['serviceProvidermobile'].value;


      this.meetupService.SPSignupWithGoogle(name, email, mobile, website, address, state, city, pincode, country, token, redirectUrl).subscribe(res => {
        let responseCode = res.headers.get('ResponseCode');
        this.googleUserSubmitprocessStart = false;
        this.changeDetectorRef.detectChanges();
        switch (responseCode) {
          case '1021':
            this.googleMobileErrorMsz = 'Email id exists';
            this.changeDetectorRef.detectChanges();
            break;
          case '1011':
            this.googleMobileErrorMsz = 'Username exists';
            this.changeDetectorRef.detectChanges();
            break;
          case '1031':
            this.googleMobileErrorMsz = 'Mobile no already exists.';
            this.changeDetectorRef.detectChanges();
            break;
          case '1112':
            this.googleMobileErrorMsz = 'Create user failure';
            this.changeDetectorRef.detectChanges();
            break;
          case '1111':
            this.isVerifyOTP = true;
            this.isGoogleSignupMobileNumberpopup = false;
            this.changeDetectorRef.detectChanges();
            // let displayName = JSON.parse(res.text()).name
            // this.meetupService.sessionId = res.headers.get('sessionId');
            // this.meetupService.isLoggedIn = true;
            // this.meetupService.redirectUrl = '';
            // this.meetupService.usertype = res.headers.get('userType');
            // this.meetupService.isUserLoggedInWithGoogle = true;
            // this.signUpCompleted(displayName);
            // this.googleMobileErrorMsz = 'Autherization successful and a session is established';
            break;
          case '1513':
            this.googleMobileErrorMsz = 'Autherization failure';
            break;
        }

      }, (error) => {
        this.googleUserSubmitprocessStart = false;
        if (error.status == 500) {

          this.googleMobileErrorMsz = 'Something went wrong in server';
        } else {
          this.googleMobileErrorMsz = 'Internal server error';
        }
      });
    }
  }
  signUpCompleted(displayName) {
    if (this.meetupService.isLoggedIn) {

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

}
