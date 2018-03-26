import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { MeetupService } from '../../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'favorite-facility-info',
  templateUrl: './favourite-facilities-info.component.html',
  styleUrls: ['./favourite-facilities-info.component.css']
})

export class FavouriteFacilitiesInfoComponent {
  @Input() facilityDetailsInfo;
  responceCode: any;
  priceText;
  favoriteFacility: boolean;
  showVerifiedIcon;
  popupMessage: string = '';
  constructor(public router: Router, public meetupService: MeetupService, public location: Location) {

  }
  ngOnInit() {

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


  changeFacilityPrice(event) {
    this.priceText = event.target.value
  }

  removeFromFavoriteList(id) {
    this.meetupService.removeItemfromFavoriteList(id).subscribe(res => {
      this.responceCode = res.headers.get('ResponseCode');
      if (this.responceCode == "2201") {
        this.meetupService.isShowPopup = true;
        this.meetupService.popupMessage = 'Favorities deleted successfully';

        location.reload();
      }
      else {
        this.meetupService.isShowPopup = true;
        this.meetupService.isWarningPopup = true;
        this.meetupService.popupMessage = 'Favorities delete failure';

      }
    })
  }
  showFacilityDetail() {
    this.router.navigate(['/consumer/facility-detail/' + this.facilityDetailsInfo.id]);
  }
  closePopup() {
    this.meetupService.isShowPopup = false;
  }
  showCalendar() {
    this.meetupService.isShowCalendarPopup = true;
    this.meetupService.facilityIdForCalendar = this.facilityDetailsInfo.id;
    this.meetupService.facilityTitleForCalendar = this.facilityDetailsInfo.title;
  }


}




