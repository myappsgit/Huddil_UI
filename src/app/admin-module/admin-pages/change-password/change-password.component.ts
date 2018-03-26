import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '../../../login/passwordValidations';
import { Router } from '@angular/router';

import { MeetupService } from '../../../provider/meetup.service';

import { AdminService } from '../../admin-providers/admin.services';

@Component({
    selector: 'change-password',
    templateUrl: 'change-password.component.html',
    styleUrls: ['change-password.component.css']
})

export class AdminChangePasswordComponent {

    form: FormGroup

    isPasswordChanged: boolean;
    isPasswordNotChanged: boolean;

    errorMsg: string = '';
    successMsg: string = '';
    passwordFormError: boolean;
    constructor(public fb: FormBuilder, public meetupService: MeetupService, public router: Router, public adminservice: AdminService) {
        this.form = this.fb.group({
            oldPassword: ['', Validators.required],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
            cpassword: ['', Validators.required]
        }, {
                validator: PasswordValidation.MatchPassword // your validation method
            })
    }

    changePassword() {

        if (this.form.controls['password'].value.length < 6 || this.form.controls['password'].value.length > 15) {
            this.passwordFormError = true;
        }
        else {
            this.passwordFormError = false;
            let currentPassword = this.form.controls['oldPassword'].value;
            let newPassword = this.form.controls['password'].value;
            let confirmNewPassword = this.form.controls['cpassword'].value;

            this.meetupService.adminChangePassword(currentPassword, newPassword, confirmNewPassword, this.adminservice.adminSessionId).subscribe(res => {
                let responseCode = res.headers.get('ResponseCode');

                switch (responseCode) {
                    case '1921':
                        this.meetupService.isShowPopup = true;
                        this.meetupService.popupMessage = 'Password changed successfully'

                        break;
                    case '1923':
                        this.isPasswordNotChanged = true;
                        this.errorMsg = 'Password & Confirm password does not match'
                        break;
                    case '1924':
                        this.isPasswordNotChanged = true;
                        this.errorMsg = 'Password cannot be empty'
                        break;
                    case '1925':
                        this.isPasswordNotChanged = true;
                        this.errorMsg = 'Old password does not match'
                        break;
                    case '1922':
                        this.isPasswordNotChanged = true;
                        this.errorMsg = 'Password change failure'
                        break;
                }

            },
                (error) => {
                    this.adminservice.isLoading = true;
                    if (error.status == 500) {
                        this.errorMsg = 'Internal server error';


                    } else {
                        this.errorMsg = 'Something went wrong in server.';

                    }
                })
        }
    }
    closePopup() {
        this.meetupService.isShowPopup = false;
        this.logout();
    }
    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.adminservice.forceLogoutWithoutSessionId();
        this.adminservice.logout().subscribe(response => {
            let responseCode = response.headers.get('ResponseCode');

            if (responseCode == "1611") {
                this.router.navigate(['']);
            }

        });
    }
}