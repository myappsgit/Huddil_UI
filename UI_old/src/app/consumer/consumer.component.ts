import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { MeetupService } from '../provider/meetup.service';


@Component({
  selector: 'consumer',
  templateUrl: './consumer.component.html',
  styleUrls: ['./consumer.component.css']
})
export class ConsumerComponent {
  isShowLatestNewsContainer: boolean = true;;
  isShowEventsContainer: boolean;
  meetingRoomLeastCost: any;
  conferenceRoomLeastCost: any;
  coworkingRoomLeastCost: any;
  trainingRoomLeastCost: any;

  constructor(public router: Router, public meetupService: MeetupService) {
    this.getLeastCost();

  }
  showLatestNewsContainer() {
    this.isShowLatestNewsContainer = true;
    this.isShowEventsContainer = false;
  }
  showEventsContainer() {
    this.isShowLatestNewsContainer = false;
    this.isShowEventsContainer = true;
  }
  goToListingPageFromBoxes(typeId) {
    this.router.navigate(['/consumer/facility-listing/0/0/' + typeId]);
  }
  openHowItWorkPopup() {
    this.meetupService.isShowHowItWorksPopup = true;
  }
  getLeastCost() {
    this.meetupService.getLeastCost().subscribe(response => {
      this.meetingRoomLeastCost = response[0][2];
      this.conferenceRoomLeastCost = response[3][2];
      this.coworkingRoomLeastCost = response[2][2];
      this.trainingRoomLeastCost = response[1][2];
    });
  }

}
