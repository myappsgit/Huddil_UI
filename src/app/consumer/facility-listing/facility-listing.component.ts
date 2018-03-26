import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'facility-listing',
  templateUrl: './facility-listing.component.html',
  styleUrls: ['./facility-listing.component.css']
})
export class FacilityListingComponent {

  filterForm: FormGroup;
  subFilterForm: FormGroup;
  minSliderValue: any;
  isShowFilterBox: boolean;
  listOfFacilities = [];
  selectedItems = [];
  dropdownSettings = {};
  multiSelectData = [];
  isLoadingData: boolean;
  noRecordFound: boolean;
  listOfLocalities = [];
  popupMessage: string = '';
  //search paramaters

  cityIdFromSearch: any;
  localityIdFromSearch: any;
  facilityTypeFromSearch: any;
  searchTitleForCity;
  searchTitleForFacilityType;

  filterBoxClassName = "filterBoxContainer hideFilterBoxContainer";

  //pagination
  totalPages;
  currentPage: number = 1;
  noOfRecordsInOnePage: number = 8;
  totalPaginationTabs: number = 0;

  errorMsz: string = '';
  isSessionExpired: boolean;

  public huddilDropdownOptionsForCity: any = {

  }
  public huddilDropdownOptionsForLocality: any = {

  }
  public huddilDropdownOptionsForFacilityType: any = {

  }

  constructor(public meetupService: MeetupService, public fb: FormBuilder, public activatedRoute: ActivatedRoute, public router: Router) {
    this.filterForm = this.fb.group({
      city: ['0', Validators.required],
      locality: ['0', Validators.required],
      facilityType: ['0', Validators.required]

    })
    this.subFilterForm = this.fb.group({
      startingPrice: ['', Validators.required],
      endingPrice: ['', Validators.required],
      seats: ['', Validators.required],
      amenity: ['', Validators.required]


    })
    this.getLocalities();
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params != null && params != undefined) {
        let city = params['city'];
        let locality = params['locality'];
        let facilityType = params['facilityType'];

        //console.log("city----->" + city);
        //console.log("locality----->" + locality);
        //console.log("facilityType----->" + facilityType);

        // this.huddilDropdownOptionsForCity = {
        //   defaultOption: city,
        //   icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
        //   width: '350px',
        //   height: '42px'
        // }
        // this.huddilDropdownOptionsForLocality = {
        //   defaultOption: locality,
        //   icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
        //   width: '350px',
        //   height: '42px'
        // }
        // this.huddilDropdownOptionsForFacilityType = {
        //   defaultOption: facilityType,
        //   icon: '<i class="fa fa-building-o" aria-hidden="true" style ="font-size:18px;"></i>',
        //   width: '350px',
        //   height: '42px'
        // }

      }

    });



    this.cityIdFromSearch = this.activatedRoute.snapshot.paramMap.get('cityId');
    this.localityIdFromSearch = this.activatedRoute.snapshot.paramMap.get('localityId');
    this.facilityTypeFromSearch = this.activatedRoute.snapshot.paramMap.get('facilityType');

    this.huddilDropdownOptionsForCity = {
      defaultOption: 'Select City',
      icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
      width: '350px',
      height: '42px',
      selectedValue: this.cityIdFromSearch
    }
    this.huddilDropdownOptionsForLocality = {
      defaultOption: 'Select Locality',
      icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
      width: '350px',
      height: '42px',
      selectedValue: this.localityIdFromSearch
    }
    this.huddilDropdownOptionsForFacilityType = {
      defaultOption: 'Select Facility Type',
      icon: '<i class="fa fa-building-o" aria-hidden="true" style ="font-size:18px;"></i>',
      width: '350px',
      height: '42px',
      selectedValue: this.facilityTypeFromSearch
    }


    this.filterForm.controls['city'].setValue(this.cityIdFromSearch);
    this.filterForm.controls['city'].valueChanges;
    this.filterForm.controls['locality'].setValue(this.localityIdFromSearch);
    this.filterForm.controls['locality'].valueChanges;
    this.filterForm.controls['facilityType'].setValue(this.facilityTypeFromSearch);
    this.filterForm.controls['facilityType'].valueChanges;

    // if (this.localityIdFromSearch != '') {
    //   this.getLocalities();
    // }
    this.getFacilities(1);


    jQuery(function () {
      jQuery('#datetimepicker').datetimepicker({
        format: 'Y-m-d H:i:s',
        todayHighlight: true
      });

    });
    jQuery(function () {
      jQuery('#datetimepicker2').datetimepicker({
        format: 'Y-m-d H:i:s'
      });
    });

    this.selectedItems = [
    ];


    this.dropdownSettings = {
      singleSelection: false,
      text: 'Select Amenities',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: false,
      classes: "myclass custom-class"
    };

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
  getFacilities(pageno) {


    this.noRecordFound = false;
    this.isLoadingData = true;
    let arr = [];
    let amenity = [];
    let fromTime = jQuery('#datetimepicker').val() != '' ? jQuery('#datetimepicker').val() : '1970-11-01 00:00:01';
    let toTime = jQuery('#datetimepicker2').val() != '' ? jQuery('#datetimepicker2').val() : '1970-11-01 00:00:01';
    let minCost = this.subFilterForm.controls['startingPrice'].value != '' ? this.subFilterForm.controls['startingPrice'].value : 0;
    let maxCost = this.subFilterForm.controls['endingPrice'].value != '' ? this.subFilterForm.controls['endingPrice'].value : 0;
    let maxCapacity = this.subFilterForm.controls['seats'].value != '' ? this.subFilterForm.controls['seats'].value : 0;
    let facilityType = this.filterForm.controls['facilityType'].value != undefined ? this.filterForm.controls['facilityType'].value : this.facilityTypeFromSearch;
    let cityId = this.filterForm.controls['city'].value != undefined ? this.filterForm.controls['city'].value : this.cityIdFromSearch;
    let localityId = this.filterForm.controls['locality'].value != undefined ? this.filterForm.controls['locality'].value : this.localityIdFromSearch;
    let offers = 0;

    let count = 8;

    arr = this.subFilterForm.controls['amenity'].value;
    if (arr.length > 0) {
      arr.forEach(element => {
        amenity.push(element.id);
      });
    }
    this.searchTitleForCity = this.filterForm.controls['city'].value;
    this.searchTitleForFacilityType = this.filterForm.controls['facilityType'].value;

    this.meetupService.getFilterDataForConsumer(fromTime, toTime, minCost, maxCost, maxCapacity, facilityType, cityId, localityId, offers, amenity, pageno, this.noOfRecordsInOnePage).subscribe(response => {
      let responseCode = response.headers.get('ResponseCode');
      this.isLoadingData = false;
      switch (responseCode) {
        case '2121':
          this.listOfFacilities = JSON.parse(response.text());

          if (this.listOfFacilities.length == 0) {
            this.noRecordFound = true;
            this.totalPaginationTabs = 0;
          }
          else {
            if (pageno == 1) {
              this.totalPages = response.headers.get('totalRecords');
              this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);
              if (this.totalPaginationTabs == 1) {
                this.totalPaginationTabs = 0;
              }
            }

          }

          break;

        case '2122':
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
            this.meetupService.popupMessage = 'Unknown error code' + responseCode;
            this.isSessionExpired = false;
          }
          break;
      }

    },
      (error) => {
        this.isLoadingData = false;
        if (error.status == 500) {
          this.errorMsz = 'Internal server error';


        } else {
          this.errorMsz = 'Something went wrong in server.';

        }
      });

  }
  toggleFilterContainer() {
    this.isShowFilterBox = !this.isShowFilterBox;
    if (this.isShowFilterBox) {
      setTimeout(() => {
        this.filterBoxClassName = "filterBoxContainer";
      }, 200);
    } else {
      setTimeout(() => {
        this.filterBoxClassName = "filterBoxContainer hideFilterBoxContainer";
      }, 100);
    }

  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  checkEndingPrice() {
    let startPrice = this.subFilterForm.controls['startingPrice'].value;
    let endPrice = this.subFilterForm.controls['endingPrice'].value;
    if (startPrice >= endPrice) {
      this.meetupService.isShowPopup = true;
      this.meetupService.isWarningPopup = true;
      this.meetupService.popupMessage = 'End price should be greater then start price.';


      this.subFilterForm.controls['endingPrice'].setValue('');
      this.subFilterForm.controls['endingPrice'].valueChanges;
    }
  }

  getLocalities() {
    this.filterForm.controls['city'].valueChanges.subscribe(value => {
      if (value != undefined) {
        let cityId = this.filterForm.controls['city'].value;

        this.meetupService.getLocalities(cityId).subscribe(res => {
          this.listOfLocalities = res;
        });
      }
    });


  }

  changeFacilityType(id) {

    this.filterForm.controls['facilityType'].setValue(id);
    this.filterForm.controls['facilityType'].valueChanges;

    this.huddilDropdownOptionsForFacilityType = {
      defaultOption: 'Select Facility Type',
      icon: '<i class="fa fa-building-o" aria-hidden="true" style ="font-size:18px;"></i>',
      width: '350px',
      height: '42px',
      selectedValue: id
    }

    this.getFacilities(1);
  }
  changeCity(id) {

    this.filterForm.controls['city'].setValue(id);
    this.filterForm.controls['city'].valueChanges;

    this.huddilDropdownOptionsForCity = {
      defaultOption: 'Select City',
      icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
      width: '350px',
      height: '42px',
      selectedValue: id
    }

    this.getFacilities(1);

  }
  facilityByPagination(page) {

    this.getFacilities(page);
  }


}

