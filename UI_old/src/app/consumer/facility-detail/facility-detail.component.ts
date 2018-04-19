import { Component, AfterViewChecked, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { initMapJS } from '../../../assets/js/customMap.js';

declare var jQuery: any;

@Component({
  selector: 'facility-detail',
  templateUrl: 'facility-detail.component.html',
  styleUrls: ['facility-detail.component.css']
})
export class FacilityDetailPageComponent implements AfterViewChecked {
  forDescription: boolean = true;
  facilitiesData: any;
  facilityamenity: any;
  facilityTiming: any;
  cost: any;
  facilityId: any;
  nearbyFacilitiesList = [];
  noNearByFacilities: boolean;
  isSendingEnquiryProcessing: boolean;
  isLoadingData: boolean;
  dateNotInitalized: boolean = false;
  isProcessing: boolean;

  form: FormGroup;
  enquiryDetailsForm: FormGroup;

  costFormErrorMessage1: string = '';
  tellUsValue: string = '';
  seatsContorl;
  endDateControl;
  forReview: boolean;
  IsAvailableForBooking: boolean;
  facilitiPhotos = [];
  sliderReady;
  sliderInitialized;
  facilityType: string;
  previousPage;
  noImageFound;
  listOfReviews: any = [];
  amenitiesList: any = [];
  popupMessage: string = '';
  termsErrorMessage1: string = '';
  enquiryDetailFormError: string = '';
  isTermsAndConditionSelected: boolean;

  selectedStartDateValue: any;
  selectedEndDateValue: any;
  userDetails: any;
  facilityLocationNameData: any;

  startDateValue: any;
  endDateValue: any;
  facilityTermsAndConditionData: any;
  seatNumber: any;
  mobile: any;
  seatValue: boolean;

  days = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(public ref: ChangeDetectorRef, public domSanitizer: DomSanitizer, public router: Router, public meetupService: MeetupService, public activatedRoute: ActivatedRoute, fb: FormBuilder) {


    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // }
    this.facilityId = '';
    this.meetupService.costFormErrorMessage1 = '';
    this.meetupService.calculateCost = null;
    this.meetupService.seatsForcalculateCost = 0;
    this.activatedRoute.queryParams.subscribe(params => {
      this.previousPage = params["previousPage"];
    });

    this.form = fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      seats: ['1', Validators.required],
      terms: ['', Validators.required]
    });

    this.seatsContorl = this.form.controls['seats'];
    this.endDateControl = this.form.controls['endDate'];
    //console.log(this.enddateIni);
    this.seatsControlInitialize();
    //this.endDateInitialize();

    this.enquiryDetailsForm = fb.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      emailId: ['', Validators.required],
      txtTellUs: ['', Validators.required],
    })
  }

  seatsControlInitialize() {
    this.meetupService.seatsForcalculateCost = 0;
    this.seatsContorl.valueChanges.subscribe(value => {
      let startDate = jQuery('#startTime').val();
      let endDate = jQuery('#endTime').val();
      this.meetupService.seatsForcalculateCost = this.form.controls['seats'].value != '' ? this.form.controls['seats'].value : 0;
      if (this.meetupService.seatsForcalculateCost == 0) {
        this.meetupService.calculateCost = null;
        this.meetupService.IsAvailableForBooking = false;
        this.meetupService.costFormErrorMessage1 = 'Enter seats';
      }
      else if (startDate == '') {
        this.meetupService.costFormErrorMessage1 = 'Select start date';
      }
      else if (endDate == '') {
        this.meetupService.costFormErrorMessage1 = 'Select end date';
      }
      else {

        this.calculateCost(startDate, endDate, this.meetupService.seatsForcalculateCost);
      }
    })
  }

  closePopup() {
    this.meetupService.isShowPopup = false;
  }

  likeDislikeFunction(status) {
    if (this.meetupService.isLoggedIn) {
      if (status) {
        this.meetupService.removeItemfromFavoriteList(this.facilityId).subscribe(response => {
          let responseCode = response.headers.get('ResponseCode');
          switch (responseCode) {
            case '2201':

              this.meetupService.isShowPopup = true;
              this.meetupService.popupMessage = 'Removed from favourite list successfully.';

              this.facilitiesData.favorites = false;
              break;
            case '2202':
              this.meetupService.isShowPopup = true;
              this.meetupService.isWarningPopup = true;
              this.meetupService.popupMessage = 'Failure removing from favourite list.';


              break;

          }
        });
      }
      else {
        this.meetupService.addItemIntoFavoriteList(this.facilityId).subscribe(response => {
          let responseCode = response.headers.get('ResponseCode');
          switch (responseCode) {
            case '2181':
              this.meetupService.isShowPopup = true;

              this.meetupService.popupMessage = 'Added to favourite list successfully.';

              this.facilitiesData.favorites = true;
              break;
            case '2182':
              this.meetupService.isShowPopup = true;
              this.meetupService.isWarningPopup = true;
              this.meetupService.popupMessage = 'Failure adding to favourite list.';

              break;
            case '2183':
              this.meetupService.isShowPopup = true;
              this.meetupService.isWarningPopup = true;
              this.meetupService.popupMessage = 'Already added to favourite list.';

              break;
          }
        });
      }
    }
    else {

      this.meetupService.previousUrl = '/consumer/facility-detail/' + this.facilityId;



      this.meetupService.isLoginPopUp = true;
    }
  }
  ngOnInit() {

    initMapJS();
    this.activatedRoute.params.forEach((params: Params) => {

      this.facilityId = params['id'];
      this.meetupService.calculateCostfacilityId = params['id'];
      this.dateNotInitalized = false;
      this.getFacilityDetails();

    });

    var self = this;
    //this.calculateCost('2017-12-20 11:00:00', '2017-12-20 11:00:00', 0);
    // Custom options for the carousel
    jQuery('body').on('change', '#endTime', function () {
      if (this.selectedEndDateValue != jQuery('#endTime').val()) {
        this.selectedEndDateValue = jQuery('#endTime').val();

        self.endDateChanged();
      }


    });
    jQuery('body').on('change', '#startTime', function () {
      if (this.selectedStartDateValue != jQuery('#startTime').val()) {
        this.selectedStartDateValue = jQuery('#startTime').val();
        self.startDateChanged();
      }

    });



  }
  endDateChanged() {
    this.meetupService.seatsForcalculateCost = 0;
    if (jQuery('#startTime').val() == '') {
      this.meetupService.costFormErrorMessage1 = 'Select start date';
      jQuery('#endTime').val('');
    }
    else {
      let startDate = jQuery('#startTime').val() == undefined ? this.form.controls['startDate'].value : jQuery('#startTime').val();
      let endDate = jQuery('#endTime').val() == undefined ? this.form.controls['endDate'].value : jQuery('#endTime').val();
      this.meetupService.seatsForcalculateCost = this.facilityType == 'Co-Working Space' ? this.form.controls['seats'].value : 0;
      if (endDate == '') {
        this.meetupService.costFormErrorMessage1 = 'Select end date';
      }
      else {

        this.calculateCost(startDate, endDate, this.meetupService.seatsForcalculateCost);

      }
    }
  }
  clickbtn() {
    this.meetupService.costFormErrorMessage1 = 'Select end date';
  }
  startDateChanged() {

    //this.meetupService.costFormErrorMessage1 = '';
    if (jQuery('#endTime').val() == '') {
      this.meetupService.costFormErrorMessage1 = 'Select end date';

      //this.appref.tick();



      //setTimeout(() => this.meetupService.costFormErrorMessage1 = "Select End Date", 0);

      jQuery('#endTime').val('');
    }
    else {
      this.meetupService.seatsForcalculateCost = 0;
      let startDate = jQuery('#startTime').val() == undefined ? this.form.controls['startDate'].value : jQuery('#startTime').val();
      let endDate = jQuery('#endTime').val() == undefined ? this.form.controls['endDate'].value : jQuery('#endTime').val();
      this.meetupService.seatsForcalculateCost = this.facilityType == 'Co-Working Space' ? this.form.controls['seats'].value : 0;
      if (endDate == '') {
        this.meetupService.costFormErrorMessage1 = 'Select end date';
      }
      else if (startDate == '') {
        this.meetupService.costFormErrorMessage1 = 'Select start date';
      }
      else {

        this.calculateCost(startDate, endDate, this.meetupService.seatsForcalculateCost);

      }
    }
  }
  ngAfterViewChecked() {
    if (!this.dateNotInitalized) {
      if (this.facilitiesData != null) {

      }
      jQuery(function () {
        var dateToday = new Date();
        jQuery('#startTime').datetimepicker({
          format: 'Y-m-d H:i:00',
          todayHighlight: true,
          minDate: dateToday,

        });


      });
      jQuery(function () {
        var dateToday = new Date();

        jQuery('#endTime').datetimepicker({
          format: 'Y-m-d H:i:00',
          minDate: dateToday
        });
      });

      if (jQuery('#startTime').val() != undefined) {
        this.dateNotInitalized = true;
      }
      var args = {
        arrowRight: '.arrow-right',
        arrowLeft: '.arrow-left',
        speed: 700,
        slideDuration: 4000
      };



    }

  }

  getFacilityDetails() {
    this.isLoadingData = true;
    this.meetupService.getConsumerFacilityDetails(this.facilityId).subscribe(response => {
      this.facilitiesData = response;
      this.isLoadingData = false;
      this.facilityLocationNameData = this.facilitiesData.location;


      this.facilityamenity = this.facilitiesData.facilityAmenities;
      this.facilityamenity.forEach(element => {
        let imageIcon = this.domSanitizer.bypassSecurityTrustHtml(element.amenity.icon);
        let id = element.amenity.id;
        let name = element.amenity.name;
        this.amenitiesList.push({ "icon": imageIcon, "id": id, "name": name });

      });

      this.facilitiesData.location.facilityTermsConditionses.forEach(element => {
        this.facilityTermsAndConditionData = element.description
      });


      this.facilityTiming = this.facilitiesData.facilityTimings;
      this.facilityType = this.facilitiesData.facilityType;

      if (this.previousPage != undefined && this.previousPage == 'booking-summary') {
        let bookingtiming = JSON.parse(sessionStorage.getItem('bookingTiming'));

        this.form.controls['startDate'].setValue(bookingtiming[0].startTime);
        this.form.controls['startDate'].valueChanges;
        this.form.controls['endDate'].setValue(bookingtiming[0].endTime);
        this.form.controls['endDate'].valueChanges;
        this.endDateChanged();
        //jQuery("#startTime").val(bookingtiming[0].startTime);
        //jQuery("#endTime").val(bookingtiming[0].endTime);
      }
      this.getReview();
      this.getNearByFacilities();
      this.getFacilityPhotos();

    });
  }

  calculateCost(fromTime, toTime, capacity) {
    this.meetupService.IsAvailableForBooking = false;
    this.isProcessing = true;
    this.meetupService.costFormErrorMessage1 = '';
    // alert(jQuery('#seats').val())
    let cap = this.facilityType == 'Co-Working Space' ? this.form.controls['seats'].value : '1';
    //console.log(cap);
    //console.log(this.meetupService.calculateCostfacilityId);
    this.meetupService.getCalculateCost(fromTime, toTime, cap, this.meetupService.calculateCostfacilityId).subscribe(response => {
      this.isProcessing = false;
      //console.log(response.responseCode);
      switch (response.responseCode) {
        case '3000':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'End time/End date should be after start time/start date';

          break;
        case '3003':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Invalid facility id';
          break;
        case '3004':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Facility not available for booking';
          break;
        case '3005':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Facility is under maintenance';
          break;
        case '3006':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Booking start time should be after facility opening time';
          break;
        case '3007':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Booking end time should be before facility closing time';
          break;
        case '3008':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Facility does not have enough seats';
          break;
        case '3020':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Seats should be non zero';
          break;
        case '3009':

          this.meetupService.IsAvailableForBooking = true;
          this.meetupService.calculateCost = response;

          break;
        case '3010':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Already booking exist for the time specified';
          break;
        case '3011':
          this.meetupService.IsAvailableForBooking = true;
          this.meetupService.calculateCost = response;


          break;
        case '3018':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Facility closed.';
          break;
        case '3019':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Booking is not allowed at this time slot.';
          break;
        case '9996':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'User is not allowed to perform this action';
          break;
        case '9999':
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Session invalid/ does not exist';
          break;
        default:
          this.meetupService.costFormErrorMessage1 = '';
          this.meetupService.calculateCost = null;
          this.meetupService.costFormErrorMessage1 = 'Unknown error code' + response.responseCode;
          break;
      }

    });
  }
  getNearByFacilities() {
    let lat = this.facilitiesData.latitude;
    let log = this.facilitiesData.longtitude;
    let facilityType = this.facilitiesData.facilityType;
    this.noNearByFacilities = false;
    this.meetupService.getNearbyLocations(lat, log, facilityType, this.facilityId).subscribe(response => {
      if (response.length == 0) {
        this.noNearByFacilities = true;
      }
      else {
        this.nearbyFacilitiesList = response;
      }
    });
  }
  bookNow() {
    if (!this.meetupService.isLoggedIn && this.form.controls['terms'].value == true) {
      this.meetupService.previousUrl = this.router.url;
      this.meetupService.isLoginPopUp = true;
    }
    else if (!this.meetupService.isLoggedIn && this.facilitiesData.location.facilityTermsConditionses == '') {
      this.meetupService.previousUrl = this.router.url;
      this.meetupService.isLoginPopUp = true;
    }
    else if (this.form.controls['terms'].value != true && this.facilitiesData.location.facilityTermsConditionses != '') {
      this.termsErrorMessage1 = ""
    }


    else if (this.form.controls['terms'].value == true || this.facilitiesData.location.facilityTermsConditionses == '') {

      let bookingTime = [];
      bookingTime.push({ 'startTime': jQuery('#startTime').val(), 'endTime': jQuery('#endTime').val() });
      sessionStorage.setItem('bookingDetails', JSON.stringify(this.facilitiesData));
      sessionStorage.setItem('costDetails', JSON.stringify(this.meetupService.calculateCost));
      sessionStorage.setItem('bookingTiming', JSON.stringify(bookingTime));
      if (this.facilityType == 'Co-Working Space') {
        sessionStorage.setItem('seats', this.form.controls['seats'].value);
      } else {
        sessionStorage.setItem('seats', this.facilitiesData.capacity);
      }

      this.router.navigate(['/consumer/booking-summary']);
    }
  }
  showDescription() {
    this.forDescription = true;
    this.forReview = false;
  }
  showreview() {
    this.forDescription = false;
    this.forReview = true;
  }
  getFacilityPhotos() {
    this.facilitiesData.facilityPhotos.forEach(photo => {
      this.meetupService.downloadFacilitiesPhotos(photo.imgPath).subscribe(response => {

        this.createImageFromBlob(response);
        this.sliderReady = true;
        //this.loadSlider();

      },
        (error) => {


          this.noImageFound = true;
        });
    });



  }
  loadSlider() {
    setTimeout(function () {
      jQuery(function () {
        var args = {
          arrowRight: '.arrow-right',
          arrowLeft: '.arrow-left',
          speed: 700,
          slideDuration: 4000
        };
        jQuery('.carousel').BannerSlide(args).set;
      });
    }, 1000);
  }
  createImageFromBlob(image: Blob) {
    let imageToShow: any;
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      imageToShow = reader.result;
      this.facilitiPhotos.push(imageToShow);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }


  }
  goBack() {
    this.router.navigate(['/consumer/facility-listing/1/0/0']);
  }
  getReview() {

    this.meetupService.getReviewsOfFacility(this.facilityId).subscribe(response => {
      this.listOfReviews = response;

    });

  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  showCalendar() {
    this.meetupService.isShowCalendarPopup = true;
    this.meetupService.facilityIdForCalendar = this.facilitiesData.id;
    this.meetupService.facilityTitleForCalendar = this.facilitiesData.title;
  }

  // termsAndConditions() {
  //   this.isTermsAndConditionSelected = true;
  // }

  showCallNowPopUp() {
    if (this.meetupService.isLoggedIn) {
      this.meetupService.getUserDetails().subscribe(response => {
        this.userDetails = response;

        let nameValue = this.userDetails.addressingName;
        let emailId = this.userDetails.emailId;
        this.mobile = this.userDetails.mobileNo.slice(3);

        this.meetupService.consumerUserData = nameValue;
        this.enquiryDetailsForm.controls['name'].setValue(nameValue);
        this.enquiryDetailsForm.controls['mobile'].setValue(this.mobile);
        this.enquiryDetailsForm.controls['emailId'].setValue(emailId);
        this.enquiryDetailsForm.controls['name'].valueChanges;
        this.enquiryDetailsForm.controls['emailId'].valueChanges;
        this.enquiryDetailsForm.controls['mobile'].valueChanges;


      });

    }

    this.tellUsValue == '';
    this.meetupService.isCallNowPopUp = true;
    this.startDateValue = jQuery('#startTime').val();
    this.endDateValue = jQuery('#endTime').val();
    this.seatNumber = this.form.controls['seats'].value;

    let name = this.enquiryDetailsForm.controls['name'].value;
    let emailId = this.enquiryDetailsForm.controls['emailId'].value;
    let mobileNumber = this.enquiryDetailsForm.controls['mobile'].value;
    let tellUsData = this.enquiryDetailsForm.controls['txtTellUs'].value;
    this.enquiryDetailFormError = '';

    if (this.facilitiesData.facilityType == 'Co-Working Space') {
      this.seatValue = true;
    }
  }
  closeCallNowPopUp() {
    this.meetupService.isCallNowPopUp = false;
    this.tellUsValue == '';
  }

  showTermsAndConditionsBox() {
    this.meetupService.isTermsAndConditionExistForSP = true;
  }
  closeSPTCPSPopup() {
    this.meetupService.isTermsAndConditionExistForSP = false;
  }
  onTermsAndConditionsSelect() {

    if (jQuery('#checkBox_terms').is(":checked") == true) {

      jQuery("#button_bookNow").removeAttr('disabled');

      jQuery("#button_bookNow").removeClass("disableButtonColor").addClass("bookNowButton");

    }
    else if (jQuery('#checkBox_terms').is(":checked") == false) {

      jQuery("#button_bookNow").prop("disabled", true);
      jQuery("#button_bookNow").removeClass("bookNowButton").addClass("disableButtonColor");
    }

  }

  isValidEmail(email) {
    let status: boolean;
    let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailPattern.test(email)) {
      status = false;
    }
    else {
      status = true;
    }
    return status;
  }
  sendEnquiryDetails() {

    let name = this.enquiryDetailsForm.controls['name'].value;
    let emailId = this.enquiryDetailsForm.controls['emailId'].value;
    let mobileNumber = this.enquiryDetailsForm.controls['mobile'].value;
    let tellUsData = this.enquiryDetailsForm.controls['txtTellUs'].value;
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    let dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    let startDateTime = jQuery('#startTime').val() != '' ? jQuery('#startTime').val() : dateTime;
    let endDateTime = jQuery('#endTime').val() != '' ? jQuery('#endTime').val() : dateTime;
    let basePrice = this.meetupService.calculateCost != null ? this.meetupService.calculateCost.basePrice : '-1';
    let sgstValue = this.meetupService.calculateCost != null ? this.meetupService.calculateCost.sGst : 0;
    let cgstValue = this.meetupService.calculateCost != null ? this.meetupService.calculateCost.cGst : 0;
    let offerData = this.meetupService.calculateCost != null ? this.meetupService.calculateCost.offer : 0;
    let totalPrice = this.meetupService.calculateCost != null ? this.meetupService.calculateCost.totalCost : 0;

    console.log(startDateTime, endDateTime, basePrice, sgstValue, offerData, cgstValue, totalPrice);

    if (name == '') {
      this.enquiryDetailFormError = 'Please enter name';
    }
    else if (emailId == '' && mobileNumber == '') {
      this.enquiryDetailFormError = 'Please enter either emailId or contact number';
    }

    else if (mobileNumber != '' && mobileNumber.length != 10) {
      this.enquiryDetailFormError = 'Please enter 10 digit contact number';
    }
    else if (emailId != '' && !this.isValidEmail(emailId)) {
      this.enquiryDetailFormError = 'Enter valid email id';
    }


    else {
      if (this.isSendingEnquiryProcessing == true) {

      }
      else {
        this.isSendingEnquiryProcessing = true;
        this.meetupService.getEnquiryDetails(this.facilityId, tellUsData, endDateTime, startDateTime, basePrice, sgstValue, cgstValue, offerData, totalPrice, emailId, mobileNumber, name).subscribe(response => {
          this.isSendingEnquiryProcessing = false;
          let responseCode = response.headers.get('ResponseCode');
          switch (responseCode) {
            case '9995':
              this.meetupService.isCallNowPopUp = false;
              this.meetupService.isShowPopup = true;
              this.meetupService.popupMessage = "Enquiry sent successfully";
              break;
            case '2485':
              this.meetupService.isCallNowPopUp = true;
              this.meetupService.isShowPopup = false;
              break;

          }

        });
      }

    }


  }

}
