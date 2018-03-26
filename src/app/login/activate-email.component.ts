import { Component, OnInit } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, Params } from '@angular/router';
import { MeetupService } from '../provider/meetup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
    selector: 'activate-email',
    templateUrl: './activate-email.component.html',
    styleUrls: [`./activate-email.component.css`]
})
export class ActivateEmailComponent implements OnInit {
    showProcessing: boolean;
    emailId;
    token;
    action;
    activateSuccessfully;
    deactivateSuccessfully;
    popupMessage: string = '';
    constructor(public activatedRoute: ActivatedRoute, public meetupService: MeetupService, public router: Router) {
        this.showProcessing = true;
    }

    ngOnInit() {
        this.token = this.activatedRoute.snapshot.queryParams["token"];
        this.emailId = this.activatedRoute.snapshot.queryParams["emailId"];
        this.action = this.activatedRoute.snapshot.queryParams["del"];

        if (this.token == '' || this.emailId == '' || this.action == '' || this.token == undefined || this.emailId == undefined || this.action == undefined) {
            this.router.navigate(['']);
        }
        if (this.action == 0) {
            this.meetupService.activateAccountByEmailLink(this.emailId, this.token).subscribe(res => {

                let responseCode = res.headers.get('ResponseCode');

                if (responseCode == '1941') {
                    this.showProcessing = false;
                    this.activateSuccessfully = true;
                    this.goToLogin();
                }
                else if (responseCode == '1942') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Not Activated. Please Contact Administrator.';

                    this.showProcessing = false;
                    this.router.navigate(['']);
                }
                else if (responseCode == '1943') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Mobile Number not verified';

                    this.showProcessing = false;
                    this.router.navigate(['']);
                }
                else if (responseCode == '1516') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Account already activated';

                    this.showProcessing = false;
                    this.router.navigate(['']);
                }
                else if (responseCode == '1515') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Account deactivated';

                    this.showProcessing = false;
                    this.router.navigate(['']);
                }
                else if (responseCode == '9999') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Invalid email id / token';

                    this.showProcessing = false;
                    this.router.navigate(['']);
                }
            });
        }
        else if (this.action == 1) {
            this.meetupService.deleteAccountByEmailLink(this.emailId, this.token).subscribe(res => {

                let responseCode = res.headers.get('ResponseCode');

                if (responseCode == '1421') {
                    this.showProcessing = false;
                    this.deactivateSuccessfully = true;
                    this.goToLogin();
                }
                else if (responseCode == '1422') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Not Deleted. Please Contact Administrator.';

                    this.showProcessing = false;
                    this.router.navigate(['']);
                }
            });
        }
    }
    goToLogin() {
        setTimeout(() => {
            this.router.navigate(['']);
        }, 5000);
    }
    closePopup() {
        this.meetupService.isShowPopup = false;
    }


}