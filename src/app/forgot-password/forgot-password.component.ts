import { Component } from '@angular/core';
import { MeetupService } from '../provider/meetup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'forgot-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['forgot-password.component.css']
})

export class ForgotPasswordComponent {
    form: FormGroup;

    isEmailSendingProcessStart: boolean
    isForgotPasswordOTPEmailSent: boolean;
    isEmailIdEntered: boolean;
    invalidEmailId: boolean;

    constructor(public meetupService: MeetupService, fb: FormBuilder) {
        this.form = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9._]+[/@]+[a-zA-Z-]+[/.]+[a-zA-Z]+[a-zA-Z]")])],
        })
    }

    sendResetPasswordLink() {
        this.isEmailSendingProcessStart = true;
        this.invalidEmailId = false;
        let email = this.form.controls['email'].value;
        let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailPattern.test(email)) {
            this.isEmailSendingProcessStart = false;
            this.isEmailIdEntered = true;
        }

        else {
            this.isEmailIdEntered = false;
            this.meetupService.sendForgotPasswordOTPtoEmail(email).subscribe(res => {

                let headers = res.headers.get('ResponseCode');
                switch (headers) {
                    case '1911':
                        this.isEmailIdEntered = false;
                        this.isEmailSendingProcessStart = false;
                        this.isForgotPasswordOTPEmailSent = true;
                        break;
                    case '1912':
                    case '1022':
                        this.isEmailIdEntered = false;
                        this.isEmailSendingProcessStart = false;
                        this.invalidEmailId = true;
                        break;



                }
            })
        }


    }
}