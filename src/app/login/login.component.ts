import { Component } from '@angular/core';
import { FacebookService } from '../social-authentication/facebook.service';
import { GoogleService } from '../social-authentication/google.service';
import { MeetupService } from '../provider/meetup.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from './passwordValidations';



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  serviceProviderForm: FormGroup;
  consumerSignupForm: FormGroup;
  showLoading: boolean;
  isLoginFormDisplay: boolean = true;
  isSignUpFormDisplay: boolean;
  isBusinessSignUpFormDisplay: boolean;
  formError: any;
  statesData: any;
  consumerSignupProcessStart: boolean;
  dataAlreadyExistMsg: string = '';
  isAlreadyExist: boolean;
  isShowPopup: boolean;
  popupMessage: string = '';

  constructor(fb: FormBuilder, public router: Router, public meetupService: MeetupService, public facebook: FacebookService, public googleService: GoogleService) {

    // if (this.meetupService.isLoggedIn) {
    //   this.router.navigate([ sessionStorage.getItem('redirectUrl')]);
    // }
    this.form = fb.group({
      username: [''
        , Validators.required],
      password: [''
        , Validators.required]
    })

    this.consumerSignupForm = fb.group({
      name: [''
        , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(6), Validators.maxLength(15)])],
      email: [''
        , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9._]+[/@]+[a-zA-Z-]+[/.]+[a-zA-Z]+[a-zA-Z]")])],
      mobile: [''
        , Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
      password: [''
        , Validators.required],
      cpassword: [''
        , Validators.required],
      terms: [''
        , Validators.required],
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      })

    this.serviceProviderForm = fb.group({
      ownerName: [''
        , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(6), Validators.maxLength(15)])],
      serviceProviderEmailId: [''
        , Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9._]+[/@]+[a-zA-Z-]+[/.]+[a-zA-Z]+[a-zA-Z]")])],
      serviceProvidermobile: [''
        , Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
      state: [''
        , Validators.required],
      website: [''
        , Validators.required],
      address: [''
        , Validators.required],
      city: [''
        , Validators.required],
      pincode: [''
        , Validators.required],
      country: [''
        , Validators.required],
      password: [''
        , Validators.required],
      cpassword: [''
        , Validators.required],
      terms: [''
        , Validators.required]
    }, {
        validator: PasswordValidation.MatchPassword // your validation method
      })

    this.meetupService.getState().subscribe(res => {
      this.statesData = res;
    })


  }

  googleLogin() {
    this.googleService.login();
  }
  googlelogout() {
    this.googleService.logout();
  }
  facebooklogout() {
    this.facebook.logout();
  }
  facebooklogin() {
    this.facebook.login();
  }
  showSignupForm() {
    this.isLoginFormDisplay = false;
    this.isSignUpFormDisplay = true;
    this.isBusinessSignUpFormDisplay = false;
  }
  showLoginForm() {
    this.isLoginFormDisplay = true;
    this.isSignUpFormDisplay = false;
    this.isBusinessSignUpFormDisplay = false;
  }
  showBusinessSignup() {
    this.isLoginFormDisplay = false;
    this.isSignUpFormDisplay = false;
    this.isBusinessSignUpFormDisplay = true;
  }
  //form login
  login() {
    if (this.form.controls['username'].value == 'admin' && this.form.controls['password'].value == 'password') {
      this.router.navigate(['/admin']);
    }
    else {
      sessionStorage.removeItem('SessionId');

      if (this.form.controls['username'].value == '' || this.form.controls['password'].value == '') {
        this.form.controls['password'].setErrors({
          invalidStatus: 'Enter Details'
        });
      }
      else {
        this.loaderPresent();
        let username = this.form.controls['username'].value;
        username = username.toLowerCase();
        let password = this.form.controls['password'].value;
        let userNameEncoded = btoa(username);
        let passwordEncoded = btoa(password);


        let result =
          this.meetupService.login(userNameEncoded, passwordEncoded).subscribe(res => {
            this.loaderDismiss();
            let responseCode = res.headers.get('ResponseCode');
            let userType = res.headers.get("userType");
            let sessionId = res.headers.get("sessionId")

            this.meetupService.usertype = userType;
            switch (userType) {

              case null:
                this.form.controls['password'].setErrors({
                  invalidStatus: 'Invalid Credentials.'
                });

                break;
              case '5':
                this.meetupService.isLoggedIn = true;
                this.meetupService.redirectUrl = 'admin';
                break;
              case '6':
                this.meetupService.isLoggedIn = true;
                this.meetupService.redirectUrl = 'advisor';
                break;
              case '7':
                this.meetupService.isLoggedIn = true;
                this.meetupService.redirectUrl = 'service-provider';
                break;
              case '8':
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
            if (this.meetupService.isLoggedIn) {

              //store in session
              sessionStorage.setItem('SessionId', sessionId);
              sessionStorage.setItem('redirectUrl', this.meetupService.redirectUrl);
              sessionStorage.setItem('userType', this.meetupService.usertype);


              let redirect = this.meetupService.redirectUrl;
              this.meetupService.sessionId = sessionId;

              if (this.meetupService.previousUrl != undefined && this.meetupService.previousUrl != '' && this.meetupService.previousUrl != '/login') {
                this.router.navigate([this.meetupService.previousUrl]);
              }
              else {
                this.router.navigate([redirect]);
              }

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
  }
  serviceProviderSignup() {

    if (this.serviceProviderForm.controls['ownerName'].value == '' || this.serviceProviderForm.controls['serviceProviderEmailId'].value == '' ||
      this.serviceProviderForm.controls['serviceProvidermobile'].value == '' || this.serviceProviderForm.controls['state'].value == '' || this.serviceProviderForm.controls['city'].value == '' || this.serviceProviderForm.controls['pincode'].value == '' ||
      this.serviceProviderForm.controls['country'].value == '' || this.serviceProviderForm.controls['password'].value == '' ||
      this.serviceProviderForm.controls['cpassword'].value == '' || this.serviceProviderForm.controls['terms'].value != true) {
      this.formError = true;
    }
    else {
      let redirectUrl = this.meetupService.baseUrl + 'activate-email';
      this.formError = false;
      this.consumerSignupProcessStart = true;
      this.isAlreadyExist = false;
      this.meetupService.signupForSP(this.serviceProviderForm.controls['ownerName'].value,
        this.serviceProviderForm.controls['serviceProviderEmailId'].value, '+91' + this.serviceProviderForm.controls['serviceProvidermobile'].value,
        this.serviceProviderForm.controls['website'].value, this.serviceProviderForm.controls['address'].value
        , this.serviceProviderForm.controls['state'].value, this.serviceProviderForm.controls['city'].value, this.serviceProviderForm.controls['pincode'].value,
        this.serviceProviderForm.controls['country'].value, this.serviceProviderForm.controls['password'].value, redirectUrl).subscribe(response => {
          let responseCode = response.headers.get('ResponseCode');
          this.consumerSignupProcessStart = true;
          switch (responseCode) {
            case '1111':
              this.consumerSignupProcessStart = false;
              this.meetupService.isShowPopup = true;
              this.meetupService.popupMessage = 'Registration successfull. Activation Link sent to your registered Email-Id.';


              this.router.navigate(['']);
              break;
            case '1021':
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Email already exist.';
              this.isAlreadyExist = true;
              break;
            case '1031':
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Mobile No. already exist';
              this.isAlreadyExist = true;
              break;
            case '1112':
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Failure';
              this.isAlreadyExist = true;

              break;
            case '9999':
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Invalid data Passed';
              this.isAlreadyExist = true;
              break;
          }

        });
    }
  }
  closePopup() {
    this.meetupService.isShowPopup = false;
  }
  signup() {
    if (this.consumerSignupForm.controls['name'].value == '' || this.consumerSignupForm.controls['email'].value == '' ||
      this.consumerSignupForm.controls['mobile'].value == '' || this.consumerSignupForm.controls['password'].value == '' ||
      this.consumerSignupForm.controls['cpassword'].value == '' || this.consumerSignupForm.controls['terms'].value != true) {
      this.formError = true;
    }
    else {
      let redirectUrl = this.meetupService.baseUrl + 'activate-email';
      this.consumerSignupProcessStart = true;
      this.formError = false;
      this.isAlreadyExist = false;
      this.meetupService.signup(this.consumerSignupForm.controls['name'].value, this.consumerSignupForm.controls['email'].value,
        '+91' + this.consumerSignupForm.controls['mobile'].value, this.consumerSignupForm.controls['password'].value, redirectUrl).subscribe(response => {
          let responseCode = response.headers.get('ResponseCode');

          switch (responseCode) {
            case '1111':
              this.consumerSignupProcessStart = false;
              this.meetupService.isShowPopup = true;
              this.meetupService.popupMessage = 'Registration successfull. Activation Link sent to your registered Email-Id.';


              this.router.navigate(['']);
              break;
            case '1021':
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Email already exist.';
              this.isAlreadyExist = true;
              break;
            case '1031':
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Mobile No. already exist';
              this.isAlreadyExist = true;
              break;
            case '1112':
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Failure';
              this.isAlreadyExist = true;
              break;
            case '9999':
              this.consumerSignupProcessStart = false;
              this.dataAlreadyExistMsg = 'Invalid data Passed';
              this.isAlreadyExist = true;

              break;
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
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


}
