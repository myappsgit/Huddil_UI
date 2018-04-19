import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MeetupService } from '../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
    selector: 'attendees-list',
    templateUrl: 'attendees-list.component.html',
    styleUrls: ['attendees-list.component.css']
})

export class AttendessListComponent {

    attendeesForm: FormGroup;
    showAttendeesListFields: boolean;
    showIfNoAttendeesData: boolean;
    countAtten = 1;
    showRequiredFiled: boolean;
    attendeesData: any;
    showAttenddesTableData: boolean;
    teamData: any;
    participantsData: any
    showParticipants: boolean;
    current: number = 0;
    noParticipantsAvailable: boolean;
    teamArray: any = [];
    teamDetails: any = [];
    teamParticipants: any = [];
    numbersArray: any = [];
    showTeamList: boolean;
    showLoader: boolean = false;

    constructor(public fb: FormBuilder, public meetupService: MeetupService, public router: Router) { }
    ngOnInit() {


        this.meetupService.getTeamDetails().subscribe(res => {
            this.teamArray = res;
            if (this.teamArray == '') {
                this.showIfNoAttendeesData = true;
                this.showTeamList = false;
            } else if (this.teamArray) {
                this.showTeamList = true;
                this.showIfNoAttendeesData = false;
            }

            this.teamArray.forEach(ele => {

                this.getTeamDetails(ele.id);
            })
        }

        )
    }

    load() {
        window.location.reload();
    }

    getTeamDetails(id) {

        this.meetupService.getParticipantsData(id).subscribe(res => {
            let resArray: any = [];
            resArray = res;
            resArray.forEach(element => {
                this.teamDetails.push(element);
            });
        })
    }

    showAddAttendeesField() {
        this.router.navigate(['/consumer/add-team']);
    }

    cancelAttendeesDetails() {
        this.showAttendeesListFields = false;
    }
    editTeam(id, name) {
        this.router.navigate(['/consumer/edit-team/' + id + '/' + name]);
    }



    removeMeetingWithParticipants(id) {
        if (confirm("Are you sure you want to delete this team?")) {
            this.meetupService.removeMeetingAsWellAsParticipants(id).subscribe(res => {
                let responcecode = res.headers.get('ResponseCode')

                if (responcecode == '2741') {
                    this.load();
                }
            })
        }
        return false;

    }

    showParticipantsDetails(id) {

        this.teamParticipants = [];
        this.teamDetails.forEach(element => {
            if (element.participantTeamId == id) {
                this.teamParticipants.push(element);

            } else {
                this.noParticipantsAvailable = false;
            }
        });
        if (this.teamParticipants.length == 0) {
            this.noParticipantsAvailable = true;
        }
        $('.participantsContainer').hide();
        $("#participantsDetails" + id).toggle();


    }


}