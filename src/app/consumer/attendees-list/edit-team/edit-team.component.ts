import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MeetupService } from '../../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';

import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
    selector: 'edit-team',
    templateUrl: 'edit-team.component.html',
    styleUrls: ['edit-team.component.css']
})

export class EditTeamComponent {

    attendeesForm: FormGroup;
    showAttendeesListFields: boolean;
    countAtten = 1;
    showRequiredFiled: boolean;
    attendeesData: any;
    numbersArray: any = [];
    showTeamList: boolean;
    showLoader: boolean = false;
    teamDetails = [];
    teamId: any;
    dataReadyForDisplay: boolean;
    teamName: string;
    emailError: boolean;

    errorMsz: string = '';
    isSessionExpired: boolean;
    mobileError: boolean;
    nameError: boolean;

    constructor(public fb: FormBuilder, public meetupService: MeetupService, public route: ActivatedRoute, public router: Router) {
        this.attendeesForm = this.fb.group({
            teamName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9 ]*"), Validators.minLength(3), Validators.maxLength(45)])]

        });
    }

    ngOnInit() {
        this.teamId = this.route.snapshot.paramMap.get('id');
        this.teamName = this.route.snapshot.paramMap.get('name');
        this.attendeesForm.controls['teamName'].setValue(this.teamName);
        this.attendeesForm.controls['teamName'].valueChanges;
        this.getTeamDetails(this.teamId);

    }

    showAddAttendeesField() {
        this.showAttendeesListFields = !this.showAttendeesListFields;
    }

    cancelAttendeesDetails() {
        this.router.navigate(['/consumer/attendees-list']);
        this.showAttendeesListFields = false;
    }

    addAttendeesList() {
        let newNumber = this.countAtten + 1;
        for (var i = 1; i < newNumber; i++) {
            this.attendeesForm.addControl('name' + newNumber, new FormControl("", Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9 ]*"), Validators.minLength(3), Validators.maxLength(45)])));
            this.attendeesForm.addControl('mobile' + newNumber, new FormControl(""));
            this.attendeesForm.addControl('email' + newNumber, new FormControl(""));
        }

        this.countAtten = newNumber;
        this.numbersArray.push(newNumber);

    }

    removeAttendeesRow(newNumber) {
        if (this.countAtten == 1) {
            alert('Team should have minimum one participant.');
        }
        else {
            let removedItem = this.numbersArray.indexOf(newNumber);
            let item = this.numbersArray.splice(removedItem, 1);
            this.attendeesForm.removeControl('name' + item);
            this.attendeesForm.removeControl('mobile' + item);
            this.attendeesForm.removeControl('email' + item);
            this.countAtten = this.countAtten - 1;
        }
    }
    checkMobileNumberValid() {
        let anserarray = [];


        for (var i = 1; i <= this.countAtten; i++) {

            let mobileVal = this.attendeesForm.controls['mobile' + i].value;

            if (this.attendeesForm.controls['mobile' + i].value != '' && mobileVal.length < 10) {
                anserarray.push({
                    i: false
                });

            }
        }


        if (anserarray.length == 0) {

            this.mobileError = false;
            return true;


        }
        else {
            this.mobileError = true;
            return false;
        }
    }
    checkNameValid() {
        let anserarray = [];
        let namePattern: RegExp = /^([a-zA-Z0-9 ]+)$/;

        for (var i = 1; i <= this.countAtten; i++) {

            let nameVal = this.attendeesForm.controls['name' + i].value;

            if (!namePattern.test(nameVal)) {
                anserarray.push({
                    i: false
                });

            }
        }


        if (anserarray.length == 0) {

            this.nameError = false;
            return true;


        }
        else {
            this.nameError = true;
            return false;
        }
    }
    saveAttendeesDetails() {
        this.emailError = false;
        this.showRequiredFiled = false;
        if ((this.attendeesForm.controls['teamName'].value == '') || (!this.checkAttendeesFilled())) {
            this.showRequiredFiled = true;
        }
        else if (!this.checkNameValid()) {
            this.nameError = true;
        }
        else if (!this.checkMobileNumberValid()) {
            this.mobileError = true;
        }
        else if (!this.checkEmailIsValid()) {
            this.emailError = true;
        }
        else if (this.attendeesForm.valid) {
            this.emailError = false;
            this.showRequiredFiled = false;
            let teamName = this.attendeesForm.controls['teamName'].value;

            let attendeesRowsdata: any = [];
            for (var i = 1; i <= this.countAtten;) {

                let email = this.attendeesForm.controls['email' + i].value;
                let mobile = this.attendeesForm.controls['mobile' + i].value;
                let name = this.attendeesForm.controls['name' + i].value;
                attendeesRowsdata.push({
                    "emailId": email,
                    "phoneNo": mobile,
                    "name": name,
                });
                i++;
            }

            this.meetupService.updateTeamAndParticipants(this.teamId, this.attendeesForm.controls['teamName'].value, attendeesRowsdata).subscribe(res => {
                this.attendeesData = res;
                this.showLoader = false;
                let responceCode = res.headers.get('ResponseCode');
                switch (responceCode) {
                    case '2811':
                        this.meetupService.isShowPopup = true;
                        this.meetupService.popupMessage = 'Team details updated successfully.';
                        this.router.navigate(['/consumer/attendees-list']);
                        break;
                    case '2742':
                        this.errorMsz = 'There is some technical problem. Please contact administrator.';
                        break;
                    case '2712':
                        this.errorMsz = 'There is some technical problem. Please contact administrator.';
                        break;

                    case ('9999'):
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                            this.isSessionExpired = true;
                            this.meetupService.isInvalidSessionPopupDisplayed = true;
                        }
                        break;
                    default:
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Unknown error code' + responceCode;
                            this.isSessionExpired = false;
                        }
                        break;
                }

            },
                (error) => {

                    if (error.status == 500) {
                        this.errorMsz = 'Internal server error';


                    } else {
                        this.errorMsz = 'Something went wrong in server.';

                    }
                })
        }



    }

    checkAttendeesFilled() {


        let anserarray = [];
        for (var i = 1; i <= this.countAtten; i++) {


            if (this.attendeesForm.controls['name' + i].value == '') {
                anserarray.push({
                    i: false
                });

            }
            // else if ((this.attendeesForm.controls['mobile' + i].value == '')) {
            //     anserarray.push({
            //         i: false
            //     });

            // }
        }
        if (anserarray.length == 0) {

            this.showRequiredFiled = false;
            return true;


        }
        else {
            this.showRequiredFiled = true;
            return false;
        }

    }

    checkEmailIsValid() {

        let anserarray = [];
        let emailPattern: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        for (var i = 1; i <= this.countAtten; i++) {

            let emailVal = this.attendeesForm.controls['email' + i].value;

            if (this.attendeesForm.controls['email' + i].value != '' && !emailPattern.test(emailVal)) {
                anserarray.push({
                    i: false
                });

            }
        }


        if (anserarray.length == 0) {

            this.emailError = false;
            return true;


        }
        else {
            this.emailError = true;
            return false;
        }


    }
    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
    getTeamDetails(id) {

        this.meetupService.getParticipantsData(id).subscribe(response => {
            this.teamDetails = response;
            //create form controls

            this.countAtten = this.teamDetails.length;
            if (this.countAtten == 0) {
                this.router.navigate(['/consumer/attendees-list']);
            }

            for (var i = 1; i <= this.countAtten; i++) {
                let item = i;
                this.attendeesForm.addControl('name' + item, new FormControl(this.teamDetails[i - 1].name, Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9 ]*"), Validators.minLength(3), Validators.maxLength(45)])));
                this.attendeesForm.addControl('mobile' + item, new FormControl(this.teamDetails[i - 1].phoneNo));
                this.attendeesForm.addControl('email' + item, new FormControl(this.teamDetails[i - 1].emailId));
            }

            this.dataReadyForDisplay = true;

        })

    }
    removeExistingRow(id) {

        if (this.teamDetails.length == 1) {
            alert('Team should have minimum one participant.');
        }
        else {
            if (confirm('Are you sure you want to delete this attendee?')) {
                this.meetupService.removeParticipant(id).subscribe(response => {
                    let responceCode = response.headers.get('ResponseCode');

                    if (responceCode == '2841') {
                        this.meetupService.isShowPopup = true;
                        this.meetupService.popupMessage = 'Attendee deleted successfully';
                        window.location.reload();
                    }
                    else if (responceCode == '2842') {
                        this.errorMsz = 'There is some technical problem. Please contact administrator.';
                    }
                    else if (responceCode == '9999') {
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                            this.isSessionExpired = true;
                            this.meetupService.isInvalidSessionPopupDisplayed = true;
                        }

                    }
                    else if (responceCode == '9996') {
                        this.errorMsz = 'User is not allowed to perform this action';
                    }
                    else {
                        if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                            this.meetupService.isShowPopup = true;
                            this.meetupService.isWarningPopup = true;
                            this.meetupService.popupMessage = 'Unknown error code' + responceCode;
                            this.isSessionExpired = false;
                        }
                    }



                },
                    (error) => {

                        if (error.status == 500) {
                            this.errorMsz = 'Internal server error';


                        } else {
                            this.errorMsz = 'Something went wrong in server.';

                        }
                    });
            }
            // this.teamDetails.splice(index, 1);
            // this.countAtten = this.countAtten - 1;
            // let item = index + 1;
            // alert(item);

            // this.attendeesForm.removeControl('name' + item);
            // this.attendeesForm.removeControl('mobile' + item);
            // this.attendeesForm.removeControl('email' + item);
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