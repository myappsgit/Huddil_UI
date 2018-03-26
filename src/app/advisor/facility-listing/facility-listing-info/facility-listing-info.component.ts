import { Component, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MeetupService } from '../../../provider/meetup.service';

@Component({
  selector: 'facility-listing-info',
  templateUrl: 'facility-listing-info.component.html',
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
  styleUrls: ['facility-listing-info.component.css']
})

export class FacilityListingInfoComponent {
  @Input() facilityInfo;

  istoolTip: boolean = false;
  showVerifiedIcon: boolean = false;

  facilityId: number;

  facilityStatus: any;
  listOfAmenities: any;
  priceText: any;

  listOfAmenitiesWithdesc = [];

  constructor(private el: ElementRef, public router: Router, public meetupservice: MeetupService, public domSanitizer: DomSanitizer) {

  }
  ngOnInit() {
    this.facilityId = this.facilityInfo.id;

    //check cost available

    if (this.facilityInfo.costPerHour > 0) {
      this.priceText = this.facilityInfo.costPerHour;
    }
    else if (this.facilityInfo.costPerDay > 0) {
      this.priceText = this.facilityInfo.costPerDay;
    }
    else {
      this.priceText = this.facilityInfo.costPerMonth;
    }


    if (this.facilityInfo.status == (8 || 12 || 14)) {
      this.showVerifiedIcon = true;
    }
    else {
      this.showVerifiedIcon = false;
    }
    //check facility status
    switch (this.facilityInfo.status) {
      case 1:
        this.facilityStatus = 'Pending For Approval';
        break;
      case 2:
        this.facilityStatus = 'Pending For Approval With Verify Request';
        break;
      case 3:
        this.facilityStatus = 'Rejected';
        break;
      case 4:
        this.facilityStatus = 'Rejected With Verify Request';
        break;
      case 5:
        this.facilityStatus = 'Verify request';
        break;
      case 6:
        this.facilityStatus = 'Reject Verify Request';
        break;
      case 7:
        this.facilityStatus = 'Approved and Not Verified';
        break;
      case 8:
        this.facilityStatus = 'Approved and Verified';
        break;
      case 9:
        this.facilityStatus = 'Deactivated by SP';
        break;
      case 10:
        this.facilityStatus = 'Verified And Stopped';
        break;
      case 11:
        this.facilityStatus = 'Blocked by advisor';
        break;
      case 12:
        this.facilityStatus = 'Verified And Blocked';
        break;
      case 13:
        this.facilityStatus = 'Blocked by admin';
        break;
      case 14:
        this.facilityStatus = 'Verified And Blocked by admin';
        break;
    }

    this.listOfAmenities = this.facilityInfo.amenities.split(',');
    this.meetupservice.listOfAmenities.forEach(facility => {

      if (this.listOfAmenities.some(x => x == facility.id)) {

        this.listOfAmenitiesWithdesc.push({ "id": facility.id, "name": facility.name, "icon": facility.icon })
      }
    });

  }
  onClickOutside(event) {
    if (!this.el.nativeElement.contains(event.target)) // similar checks
      this.istoolTip = false;
  }
  showTooltip() {
    this.istoolTip = !this.istoolTip;
  }
  showFacilityDetail() {

    this.router.navigate(['advisor/facility-listing/facility-detail/' + this.facilityId]);
  }
  changeFacilityPrice(event) {
    this.priceText = event.target.value

  }
  showCalendar() {
    this.meetupservice.isShowCalendarPopup = true;
    this.meetupservice.facilityIdForCalendar = this.facilityInfo.id;
    this.meetupservice.facilityTitleForCalendar = this.facilityInfo.title;
  }

}

