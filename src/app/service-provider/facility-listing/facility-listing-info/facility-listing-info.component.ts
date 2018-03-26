import { Component, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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
  facilityId;
  facilityStatus;
  listOfAmenities: any = [];
  listOfAmenitiesWithdesc = [];

  priceText;
  constructor(private el: ElementRef, public router: Router, public meetupservice: MeetupService) {

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
        this.facilityStatus = 'Approved';
        break;
      case 8:
        this.facilityStatus = 'Verified';
        break;
      case 9:
        this.facilityStatus = 'Stopped';
        break;
      case 10:
        this.facilityStatus = 'Verified And Stopped';
        break;
      case 11:
        this.facilityStatus = 'Blocked';
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
    this.router.navigate(['/service-provider/facility-detail/' + this.facilityId]);
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

