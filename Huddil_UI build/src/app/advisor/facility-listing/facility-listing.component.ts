import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'facility-listing',
  templateUrl: './facility-listing.component.html',
  styleUrls: ['./facility-listing.component.css']
})
export class FacilityListingComponent {

  form: FormGroup;
  searchTitleForm: FormGroup;

  facilitiesList: any;
  listOfCities: any;
  listOfFacilities: any;
  listOfLocalities: any;
  advisorFacilitiesData: any = [];

  errorMessage: string = '';

  showLoader: boolean = true;
  showFilterData: boolean;
  noSearchDataFound: boolean;
  isShowFilterBox: boolean;
  isSessionExpired: boolean;

  totallRecordCount: any;
  pageCount: number;
  //pagination
  totalPages;
  currentPage: number = 1;
  noOfRecordsInOnePage: number = 6;
  totalPaginationTabs: number = 0;
  selectedFacility: number;
  statusOptions = [
    { id: "0", name: "All" },
    { id: "1", name: "Pending for approval" },
    { id: "2", name: "Rejected" },
    { id: "3", name: "Approved" },
    { id: "4", name: "Stopped or Blocked" },
    { id: "5", name: "Pending Certification" },
    { id: "6", name: "Huddil Verified" }
  ];

  public huddilDropdownOptionsForFacilityType: any = {
    defaultOption: 'Select Facility Type',
    icon: '<i class="material-icons iconContainer" style ="font-size:18px;">supervisor_account</i>',
    width: '230px',
    height: '42px'
  }
  public huddilDropdownOptionsForCity: any = {
    defaultOption: 'Select City',
    icon: '<i class="fa fa-map-marker iconContainer" aria-hidden="true" style ="font-size:18px;"></i>',
    width: '230px',
    height: '42px'
  }
  public huddilDropdownOptionsForLocality: any = {
    defaultOption: 'Select Locality',
    icon: '<i class="fa fa-map-marker iconContainer" aria-hidden="true" style ="font-size:18px;"></i>',
    width: '230px',
    height: '42px'
  }
  public huddilDropdownOptionsForStatusOptions: any = {

  }

  constructor(public meetupService: MeetupService, fb: FormBuilder, public routes: Router, public activatedRoute: ActivatedRoute) {
    this.form = fb.group({
      selectCity: ['0', Validators.required],
      selectLocality: ['0', Validators.required],
      selectFacility: ['0', Validators.required],
      status: ['', Validators.required]
    });

    this.searchTitleForm = fb.group({
      searchTitle: ['', Validators.required]
    });

    this.getlocalityDataBasedOnSelectedCity();
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params != null && params != undefined) {
        this.selectedFacility = params['status'];
        //this.form.controls['status'].setValue(params['status']);
        //this.form.controls['status'].valueChanges;
      }
      this.huddilDropdownOptionsForStatusOptions = {
        defaultOption: 'Select Status',
        icon: '<i class="material-icons" style ="font-size:18px;">description</i>',
        width: '230px',
        height: '42px',
        selectedValue: this.selectedFacility
      }

    });
    this.searchFacilitiesByFilters(1);
  }

  getFacilityByAdvisor(page) {
    let pageno = 1;
    let count = 6;
    this.meetupService.getFacilitiesForAdvisorData(pageno, count).subscribe(res => {

      this.advisorFacilitiesData = JSON.parse(res.text());
      //console.log(this.advisorFacilitiesData);
      if (page == 1) {
        this.totalPages = res.headers.get('totalRecords');
        this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);
      }

      this.showLoader = false;
      let responseCode = res.headers.get('ResponseCode');
      switch (responseCode) {
        case ('2121'):
          this.showLoader = false;
          this.noSearchDataFound = false;
          this.advisorFacilitiesData.reverse();
          break;
        case ('2122'):
          this.showLoader = false;
          this.noSearchDataFound = false;
          this.errorMessage = 'There is some technical problem. Please contact administrator.';
          break;
        case ('9999'):
          if (!this.meetupService.isInvalidSessionPopupDisplayed) {
            this.noSearchDataFound = false;
            this.meetupService.isShowPopup = true;
            this.meetupService.isWarningPopup = true;
            this.meetupService.popupMessage = 'your session has expired. Please login again.';
            this.isSessionExpired = true;
            this.meetupService.isInvalidSessionPopupDisplayed = true;
          }
          break;
        default:
          if (!this.meetupService.isInvalidSessionPopupDisplayed) {
            this.noSearchDataFound = false;
            this.meetupService.isShowPopup = true;
            this.meetupService.isWarningPopup = true;
            this.meetupService.popupMessage = 'Unknown error code' + responseCode;
            this.isSessionExpired = false;
          }
          break;
      }


    },
      (error) => {
        this.showLoader = false;
        if (error.status == 500) {
          this.noSearchDataFound = false;
          this.errorMessage = 'Internal server error';

        } else {
          this.noSearchDataFound = false;
          this.errorMessage = 'Something went wrong in server';
        }
      })
  }



  getlocalityDataBasedOnSelectedCity() {
    this.form.controls['selectCity'].valueChanges.subscribe(value => {
      if (value != undefined) {
        let cityId = this.form.controls['selectCity'].value;

        this.meetupService.getLocalities(cityId).subscribe(res => {
          this.listOfLocalities = res;
        });
      }
    });


  }

  searchFacilitiesByFilters(page) {
    let isOnline: boolean = navigator.onLine;

    if (isOnline == false) {
      this.showLoader = false;
      this.errorMessage = 'You are offline. Please check your network';
    } else {
      // if (page == 1) {
      //   this.totalPaginationTabs = 0;
      // }
      this.currentPage = page;
      this.showLoader = true;
      this.noSearchDataFound = false;
      this.advisorFacilitiesData = [];
      let searchTitle = this.searchTitleForm.controls['searchTitle'].value != '' ? this.searchTitleForm.controls['searchTitle'].value : null;
      let city = this.form.controls['selectCity'].value ? this.form.controls['selectCity'].value : 0;
      let locality = this.form.controls['selectLocality'].value ? this.form.controls['selectLocality'].value : 0;
      let facility = this.form.controls['selectFacility'].value ? this.form.controls['selectFacility'].value : 0;
      let status;
      if ((this.selectedFacility > 0 && this.form.controls['status'].value == '') || (this.form.controls['status'].value == undefined)) {
        status = this.selectedFacility;
      }
      else {
        this.selectedFacility = 0;
        status = this.form.controls['status'].value ? this.form.controls['status'].value : 0;
      }
      this.meetupService.getFacilitiesByFiltersForAdvisor(city, locality, 0, facility, status, searchTitle, page, this.noOfRecordsInOnePage).subscribe(response => {
        this.advisorFacilitiesData = JSON.parse(response.text());
        if (this.advisorFacilitiesData.length == 0) {
          this.showLoader = false;
          this.noSearchDataFound = true;
        }
        else if (this.advisorFacilitiesData.length > 0) {
          this.showLoader = false;
          if (page == 1) {

            this.totalPages = response.headers.get('totalRecords');
            let checkIfPaginationNotRequired = this.totalPages / this.noOfRecordsInOnePage;

            if (checkIfPaginationNotRequired < 1) {

              this.totalPaginationTabs = 0;
            }
            else {
              this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);
            }

          }
          let responseCode = response.headers.get('ResponseCode');
          switch (responseCode) {
            case ('2121'):
              this.showLoader = false;
              this.noSearchDataFound = false;
              break;
            case ('2122'):
              this.errorMessage = 'There is some technical problem. Please contact administrator.';
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

        }

      }, (error) => {
        this.showLoader = false;
        if (error.status == 500) {
          this.errorMessage = 'Internal server error';

        } else {
          this.errorMessage = 'Something went wrong in server';
        }
      });
    }
  }

  showExtraFilterBox() {
    this.isShowFilterBox = !this.isShowFilterBox

  }
  hideExtraFilterBox() {
    this.isShowFilterBox = false;
  }
  facilityByPagination(page) {
    this.searchFacilitiesByFilters(page);
  }
  closePopup(type) {
    if (type == "1") {
      this.meetupService.isShowPopup = false;
      this.meetupService.forceLogoutWithoutSessionId();
      this.routes.navigate(['']);
    }
    else if (type == "0") {
      this.meetupService.isShowPopup = false;

    }

  }
}
