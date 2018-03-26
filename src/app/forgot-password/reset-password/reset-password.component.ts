import { Component, OnInit } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, Params } from '@angular/router';
import { MeetupService } from '../../provider/meetup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidation } from '../../partner-signup/passwordValidations';


@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: [`./reset-password.component.css`]
})
export class ResetPasswordComponent implements OnInit {

    form: FormGroup;

    isSubmitting: boolean;

    token: any;

    constructor(public activatedRoute: ActivatedRoute, public meetupService: MeetupService, public router: Router, fb: FormBuilder) {
        this.form = fb.group({
            password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
            cpassword: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9._]+[/@]+[a-zA-Z-]+[/.]+[a-zA-Z]+[a-zA-Z]")])],
        }, {
                validator: PasswordValidation.MatchPassword // your validation method
            });
    }
    ngOnInit() {
        // subscribe to router event
        this.token = this.activatedRoute.snapshot.queryParams["token"];
        this.form.controls['email'].setValue(this.activatedRoute.snapshot.queryParams["emailId"]);
        this.form.controls['email'].valueChanges;
        if (this.token == '' || this.token == null || this.token == undefined) {
            this.router.navigate(['']);
        }

    }

    resetPassword() {
        let newpassword = btoa(this.form.controls['password'].value);
        let confirmpassword = btoa(this.form.controls['cpassword'].value);
        let email = this.form.controls['email'].value;
        if (newpassword == '' || confirmpassword == '' || email == '') {
            this.isSubmitting = false;
        }
        else if (this.form.valid) {
            this.isSubmitting = true;
            this.meetupService.resetPassword(newpassword, confirmpassword, email, this.token).subscribe(res => {
                let responseCode = res.headers.get('ResponseCode');

                if (responseCode == '1921') {
                    this.isSubmitting = false;
                    alert('Password Changed Successfully');
                    this.router.navigate(['']);
                }
                else if (responseCode == '1922') {
                    this.isSubmitting = false;
                    alert('Password Not Changed');
                }
                else if (responseCode == '1923') {
                    this.isSubmitting = false;
                    alert('Password do not match ');
                }
                else if (responseCode == '1924') {
                    this.isSubmitting = false;
                    alert('Password cannot be null');
                }
            }
            );
        }


    }


}