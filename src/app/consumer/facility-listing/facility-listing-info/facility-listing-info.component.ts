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
  @Input() facilityDetailsInfo;
  priceText;
  istoolTip: boolean;
  listOfAmenities = [];
  listOfAmenitiesWithdesc = [];
  constructor(private el: ElementRef, public router: Router, public meetupService: MeetupService) {

  }
  ngOnInit() {
    this.listOfAmenities = this.facilityDetailsInfo.amenities.split(',');

    this.meetupService.listOfAmenities.forEach(facility => {

      if (this.listOfAmenities.some(x => x == facility.id)) {

        this.listOfAmenitiesWithdesc.push({ "id": facility.id, "name": facility.name, "icon": facility.icon })
      }
    });

    if (this.facilityDetailsInfo.costPerHour > 0) {
      this.priceText = this.facilityDetailsInfo.costPerHour;
    }
    else if (this.facilityDetailsInfo.costPerDay > 0) {
      this.priceText = this.facilityDetailsInfo.costPerDay;
    }
    else {
      this.priceText = this.facilityDetailsInfo.costPerMonth;
    }
  }
  onClickOutside(event) {
    if (!this.el.nativeElement.contains(event.target)) // similar checks
      this.istoolTip = false;
  }
  changeFacilityPrice(event) {
    this.priceText = event.target.value

  }
  showTooltip() {
    this.istoolTip = !this.istoolTip;
  }
  showFacilityDetail() {
    this.router.navigate(['/consumer/facility-detail/' + this.facilityDetailsInfo.id]);
  }
  showCalendar() {
    this.meetupService.isShowCalendarPopup = true;
    this.meetupService.facilityIdForCalendar = this.facilityDetailsInfo.id;
    this.meetupService.facilityTitleForCalendar = this.facilityDetailsInfo.title;
  }
}

