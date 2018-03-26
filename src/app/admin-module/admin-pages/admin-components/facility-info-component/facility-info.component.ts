import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../../admin-providers/admin.services';
import { MeetupService } from '../../../../provider/meetup.service';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'facility-info-component',
  templateUrl: 'facility-info.component.html',
  styleUrls: ['facility-info.component.css']
})

export class FacilityListingInfoComponent {
  @Input() facilityTypeData;
  priceText: any;
  istoolTip: boolean;
  forCertifiedIcon: boolean;
  listOfAmenities = [];
  listOfAmenitiesWithdesc: any = [];
  facilityStatus:any;

  facilityId: any;

  constructor(public router: Router, public adminService: AdminService, public domSanitizer: DomSanitizer,
    public meetupService: MeetupService) {

  }

  ngOnInit() {

    this.listOfAmenities = this.facilityTypeData.amenities.split(',');


    //dynamic aminities


    this.meetupService.listOfAmenities.forEach(facility => {
      if (this.listOfAmenities.some(x => x == facility.id)) {
        this.listOfAmenitiesWithdesc.push({ "id": facility.id, "name": facility.name, "icon": facility.icon })

      }
    });


    if (this.facilityTypeData.costPerHour > 0) {
      this.priceText = this.facilityTypeData.costPerHour;
    }
    else if (this.facilityTypeData.costPerDay > 0) {
      this.priceText = this.facilityTypeData.costPerDay;
    }
    else {
      this.priceText = this.facilityTypeData.costPerMonth;
    }
    // for certification icon
    if (this.facilityTypeData.status == 8 || this.facilityTypeData.status == 10 || this.facilityTypeData.status == 12 || this.facilityTypeData.status == 14) {
      this.forCertifiedIcon = true;
    }

    //check facility status

    switch (this.facilityTypeData.status) {
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

  }

  showCalendar() {
    this.meetupService.isShowCalendarPopup = true;
    this.meetupService.facilityIdForCalendar = this.facilityTypeData.id;
    this.meetupService.facilityTitleForCalendar = this.facilityTypeData.title;
  }

  changeFacilityPrice(event) {
    this.priceText = event.target.value
  }

  showTooltip() {
    this.istoolTip = !this.istoolTip;
  }

  // showFacilityDetail(id) {
  //   // alert(id);
  //   this.router.navigate(['admin/facility-detail/' + id]);
  // }
  showFacilityDetail(id) {
    //alert(id);
    this.router.navigate(['/admin/facility-detail/' + id]);
  }
}

