import { Component, ElementRef, isDevMode, ViewChild } from '@angular/core';

import { MeetupService } from '../../provider/meetup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

import * as $ from 'jquery';

@Component({
  selector: 'landing-screen',
  templateUrl: './landing-screen.component.html',
  styleUrls: ['./landing-screen.component.css']
})
export class LandingScreenComponent {

  @ViewChild('huddilCustomDropDownCity') huddilCustomDropDownCity;
  @ViewChild('huddilCustomDropDownLocality') huddilCustomDropDownLocality;
  @ViewChild('huddilCustomDropDownFacilityType') huddilCustomDropDownFacilityType;

  searchForm: FormGroup;
  listOfLocalities = [];
  popupMessage: string = '';
  isScroll: boolean;

  public huddilDropdownOptionsForCity: any = {
    defaultOption: 'Select City',
    icon: '<i class="fa fa-map-marker" aria-hidden="true"></i>',
    height: '50px',
    width: '220px'
  }
  public huddilDropdownOptionsForLocality: any = {
    defaultOption: 'Select Locality',
    icon: '<i class="fa fa-map-marker" aria-hidden="true"></i>',
    height: '50px',
    width: '220px'
  }
  public huddilDropdownOptionsForFacilityType: any = {
    defaultOption: 'Select Facility Type',
    icon: '<i class="fa fa-building-o" aria-hidden="true"></i>',
    height: '50px',
    width: '220px'
  }

  constructor(private el: ElementRef, public meetupService: MeetupService, fb: FormBuilder, public router: Router) {

    this.searchForm = fb.group({
      city: ['0', Validators.required],
      locality: ['0', Validators.required],
      facilityType: ['0', Validators.required]
    });
    this.getLocalities();
  }

  ngOnInit() {

    //console.log("From landing screen. Message 1.");
    if (!isDevMode) {
      // console.log("From landing screen. Production mode.");
    } else {
      // console.log("From landing screen. Development mode.")
    }

    $("#slideshow > div:gt(0)").hide();

    setInterval(function () {
      $('#slideshow > div:first')
        .fadeOut(3000)
        .next()
        .fadeIn(3000)
        .end()
        .appendTo('#slideshow');
    }, 6000);
  }

  getLocalities() {
    this.searchForm.controls['city'].valueChanges.subscribe(value => {
      if (value != undefined) {
        let cityId = this.searchForm.controls['city'].value;

        this.meetupService.getLocalities(cityId).subscribe(res => {
          this.listOfLocalities = res;
        });
      }
    });


  }

  goToListingPage() {

    let city = this.searchForm.controls['city'].value != undefined ? this.searchForm.controls['city'].value : 0;
    let locality = this.searchForm.controls['locality'].value != undefined ? this.searchForm.controls['locality'].value : 0;
    let facilityType = this.searchForm.controls['facilityType'].value != undefined ? this.searchForm.controls['facilityType'].value : 0;



    //console.log("this.huddilCustomDropDownCity.selectedItem:" + this.huddilCustomDropDownCity.selectedItem);
    //console.log("this.huddilCustomDropDownLocality.selectedItem:" + this.huddilCustomDropDownLocality.selectedItem);
    //console.log("this.huddilCustomDropDownFacilityType.selectedItem:" + this.huddilCustomDropDownFacilityType.selectedItem);

    if (city == 0 && locality == 0 && facilityType == 0) {
      this.meetupService.isShowPopup = true;
      this.meetupService.isWarningPopup = true;
      this.meetupService.popupMessage = 'Please select at least one field.';
    }
    else {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          'city': this.huddilCustomDropDownCity.selectedItem,
          'locality': this.huddilCustomDropDownLocality.selectedItem,
          'facilityType': this.huddilCustomDropDownFacilityType.selectedItem
        }
      };

      this.router.navigate(['/consumer/facility-listing/' + city + '/' + locality + '/' + facilityType], navigationExtras);
    }
  }
  closePopup() {
    this.meetupService.isShowPopup = false;
  }
  scrollToNextDiv() {
    this.isScroll = true;
  }
  onScroll() {
    $('html, body').animate({
      scrollTop: $(".page-content").offset().top
    }, 900);
  }

}
