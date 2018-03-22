import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'facility-listing',
  templateUrl: './facility-listing.component.html',
  styleUrls: ['./facility-listing.component.css']
})
export class FacilityListingComponent {

  facilitiesList: any = [];
  form: FormGroup;
  searchTitleForm: FormGroup;
  listOfCities;
  listOfFacilities;
  listOfLocalities;
  isShowFilterBox;
  isLoadingData: boolean;
  errorMessage = '';
  formvalueChanged;
  noRecordFound: boolean;
  selectedFacility: number;

  //pagination
  totalPages;
  currentPage: number = 1;
  noOfRecordsInOnePage: number = 6;
  totalPaginationTabs: number = 0;

  defaultPageForPagination: number = 1;


  isSessionExpired: boolean;

  statusOptions = [
    { id: "0", name: "All" },
    { id: "1", name: "Pending for approval" },
    { id: "2", name: "Denied" },
    { id: "3", name: "Approved" },
    { id: "4", name: "Stopped or Blocked" }
  ];
  public huddilDropdownOptionsForCity: any = {
    defaultOption: 'Select City',
    icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
    width: '230px',
    height: '38px'
  }
  public huddilDropdownOptionsForLocality: any = {
    defaultOption: 'Select Locality',
    icon: '<i class="fa fa-map-marker" aria-hidden="true" style ="font-size:18px;"></i>',
    width: '230px',
    height: '38px'
  }
  public huddilDropdownOptionsForFacilityType: any = {
    defaultOption: 'Select Facility Type',
    icon: '<i class="material-icons" style ="font-size:18px;">supervisor_account</i>',
    width: '230px',
    height: '38px'
  }
  public huddilDropdownOptionsForStatusOptions: any = {
  }



  constructor(public meetupService: MeetupService, fb: FormBuilder, public router: Router, public activatedRoute: ActivatedRoute) {
    // console.log('pageniNo----' + this.meetupService.currentPaginationPage);
    // console.log('preurl' + this.meetupService.spPreviousURL);

    if (this.meetupService.spPreviousURL == 'facility-detail') {
      this.defaultPageForPagination = this.meetupService.currentPaginationPage;
      this.totalPaginationTabs = this.meetupService.totalRecordsPagination;
      this.currentPage = this.meetupService.currentPaginationPage;
    }
    this.form = fb.group({
      selectCity: ['0', Validators.required],
      selectLocality: ['0', Validators.required],
      selectFacility: ['0', Validators.required],
      status: ['', Validators.required]
    });

    this.searchTitleForm = fb.group({
      searchTitle: ['', Validators.required]
    });
    // this.searchFacilitiesByFilters(this.currentPage);
    //this.getFacilityData(this.currentPage);
    this.getlocalityDataBasedOnSelectedCity();
  }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => {
      if (params != null && params != undefined) {
        this.selectedFacility = params['status'];
        // this.form.controls['status'].setValue(params['status']);
        //this.form.controls['status'].valueChanges;
      }
      this.huddilDropdownOptionsForStatusOptions = {
        defaultOption: 'Select Status',
        icon: '<i class="material-icons" style ="font-size:18px;">description</i>',
        width: '230px',
        height: '38px',
        selectedValue: this.selectedFacility
      }
      this.searchFacilitiesByFilters(this.defaultPageForPagination);
    });

  }
  getFacilityData(page) {
    // if (page == 1) {
    //   this.totalPaginationTabs = 0;
    // }
    this.facilitiesList = [];
    this.noRecordFound = false;
    this.isLoadingData = true;

    let exisitingRecords = page * this.noOfRecordsInOnePage;
    this.currentPage = page;
    this.meetupService.getFacilityData(page, this.noOfRecordsInOnePage).subscribe(response => {
      this.isLoadingData = false;

      this.facilitiesList = JSON.parse(response.text());
      let responseCode = response.headers.get('ResponseCode');
      switch (responseCode) {
        case '2121':
          if (page == 1) {
            this.totalPages = response.headers.get('totalRecords');
            this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);
          }

          this.facilitiesList.reverse();
          if (this.facilitiesList.length == 0) {
            this.noRecordFound = true;
          }
          break;

        case '2122':
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

    },
      (error) => {
        this.isLoadingData = false;
        if (error.status == 500) {
          this.errorMessage = 'Internal server error';

        } else {
          this.errorMessage = 'Something went wrong in server';
        }
      });

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

    this.errorMessage = '';
    let isOnline: boolean = navigator.onLine;
    if (isOnline == false) {
      this.errorMessage = 'You are offline. Please check your network';
    } else {
      // if (page == 1) {
      //   this.totalPaginationTabs = 0;
      // }
      this.currentPage = page;
      this.facilitiesList = [];
      this.isLoadingData = true;
      this.noRecordFound = false;
      let status;
      let searchTitle = this.searchTitleForm.controls['searchTitle'].value != '' ? this.searchTitleForm.controls['searchTitle'].value : null;
      let city = this.form.controls['selectCity'].value ? this.form.controls['selectCity'].value : 0;
      let locality = this.form.controls['selectLocality'].value ? this.form.controls['selectLocality'].value : 0;
      let facility = this.form.controls['selectFacility'].value ? this.form.controls['selectFacility'].value : 0;
      //alert(this.form.controls['status'].value);
      if ((this.selectedFacility > 0 && this.form.controls['status'].value == '') || (this.form.controls['status'].value == undefined)) {
        status = this.selectedFacility;
      }
      else {
        this.selectedFacility = 0;
        status = this.form.controls['status'].value ? this.form.controls['status'].value : 0;
      }

      if (status == undefined) {
        status = 0;
      }
      this.meetupService.getFacilitiesByFilters(city, locality, 0, facility, status, searchTitle, page, this.noOfRecordsInOnePage).subscribe(response => {
        let responseCode = response.headers.get('ResponseCode');
        this.isLoadingData = false;
        switch (responseCode) {
          case '2121':
            this.isLoadingData = false;
            this.facilitiesList = JSON.parse(response.text());
            if (this.facilitiesList.length == 0) {
              this.noRecordFound = true;
            }
            else {
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
            }
            break;
          case '2122':
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

      },
        (error) => {
          this.isLoadingData = false;
          if (error.status == 500) {
            this.errorMessage = 'Internal server error';

          } else {
            this.errorMessage = 'Something went wrong in server';
          }
        });
    }
  }
  showExtraFilterBox() {
    if (this.isShowFilterBox == true) {
      this.isShowFilterBox = false;
    }
    else {
      this.isShowFilterBox = true;
    }
  }
  hideExtraFilterBox() {
    this.isShowFilterBox = false;
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
  facilityByPagination(page) {
    this.searchFacilitiesByFilters(page);
  }

}
