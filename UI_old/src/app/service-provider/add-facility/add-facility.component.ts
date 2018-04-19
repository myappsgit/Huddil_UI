import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MeetupService } from '../../provider/meetup.service';
import { Router, NavigationExtras } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// import '../../../assets/js/timepicker.js';
// import '../../../assets/css/timepicker.css';
import { loadMap, initMapJS, gps_search } from '../../../assets/js/customMap.js';

declare var jQuery: any;


@Component({
    selector: 'add-facility',
    templateUrl: './add-facility.component.html',
    styleUrls: ['./add-facility.component.css']
})
export class AddFacilityComponent {

    loadAPI: Promise<any>;
    facilityDetailForm: FormGroup;
    addLocatioForm: FormGroup;
    priceDetailForm: FormGroup;
    showCancellationBox;
    isFacilityDetailStepShow = true;
    isPriceDetailStepShow;
    isSubmitStepShow;
    image;
    previewSrc;
    uploadedImages = [];
    imagesData = [];
    isShowAddLocationPopup;
    isOfflineMode: boolean;
    facilitiesList;
    citiesList;
    listOfLocalities;
    listOfLocations = [];
    selectedAmeninties = [];
    facilityFormData: any = [];
    priceDetailFormData: any = [];
    monthRows = [];
    totalMonths = ['NOT', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    nextMonth = 1;
    showDayRow2;
    facilityDetailFormError: string = '';
    priceDetailFormError: string = '';
    imagesPathAfterUpload = [];
    offerStartDate;
    offerEndDate;
    popupMessage: string = '';
    amenitiesList = [];
    showdaysBox;
    locationAddError;
    addLocationProcessStart: boolean;
    formSubmitProcessStart: boolean;
    latitude: any;
    longitude: any;
    gpsData = [];
    errorMsz: string = '';
    isSessionExpired: boolean;
    addFacilityProcessStart: boolean;
    showExpandIconforAddDays: boolean;
    saveFacilityStatus: boolean;
    emailStatus: string = '';
    mobileNumberStatus: string = '';
    showExpandIcon: boolean;
    errorMszForSave: string = '';
    savedFacilityId: any;
    listOfSavedFacilities: any = [];
    listOfAmenitiessSaved: any = [];

    constructor(public fb: FormBuilder, public meetupService: MeetupService, public router: Router, public domSanitizer: DomSanitizer) {


        this.facilityDetailForm = fb.group({
            facilityType: ['0', Validators.required],
            city: ['', Validators.required],
            locality: ['', Validators.required],
            location: ['0', Validators.required],
            meetingRoomName: ['', Validators.required],
            numberOfSeats: ['', Validators.required],
            areaSize: ['', Validators.required],
            gps: ['12.9538477,77.3507442', Validators.required],
            description: ['', Validators.required],
            nearby: ['', Validators.required]

        })

        this.addLocatioForm = fb.group({
            selectCity: ['', Validators.required],
            selectLocality: ['', Validators.required],
            txtName: ['', Validators.required],
            txtAddress: ['', Validators.required],
            txtLandmark: ['', Validators.required],
            txtNearBy: ['', Validators.required],
            txtAreaTermsAndConditions: ['', Validators.required]
        })

        this.priceDetailForm = fb.group({
            costPerHour: ['', Validators.required],
            costPerDay: ['', Validators.required],
            costPerMonth: ['', Validators.required],
            day1: ['', Validators.required],
            dayStatus1: ['1', Validators.required],
            dayStartTime1: ['08:00:00', Validators.required],
            dayEndTime1: ['20:00:00', Validators.required],

            offerDuration: ['', Validators.required],
            offerPrice: ['', Validators.required],
            noOfDaysBefore1: ['', Validators.required],
            cancelationCharge1: ['', Validators.required],
            noOfDaysBefore2: ['', Validators.required],
            cancelationCharge2: ['', Validators.required],
            noOfDaysBefore3: ['', Validators.required],
            cancelationCharge3: ['', Validators.required],
            spContactNumber: ['', Validators.required],
            spEmail: ['', Validators.required],
            spAlternateContactNumber: ['', Validators.required],
            spAlternateEmail: ['', Validators.required],
            paymentMethod: ['', Validators.required],

            huddilVerify: ['']


        })
        this.showSavedFacilities();
        this.getCities();
        //this.getAmenities();
        this.getFacilities();
        this.readLocations();

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
    ngOnInit() {

        initMapJS();
        // loadMap();
        setTimeout(() => {
            gps_search();
        }, 3000);


    }

    // ngOnInit() {
    //     loadMap();
    // }

    readLocations() {
        this.meetupService.getLocationBySP().subscribe(response => {
            //console.log(response);
            this.listOfLocations = response
        });
    }

    showFacilityDetailsStep() {
        this.isOfflineMode = !this.isOfflineMode
        this.isFacilityDetailStepShow = true;
        this.isPriceDetailStepShow = false;
        this.isSubmitStepShow = false;
    }
    showPriceDetailsStep() {
        this.gpsData = jQuery('#input_gps').val().split(',');


        jQuery(function () {
            var dateToday = new Date();
            jQuery("#datePicker").datepicker({
                dateFormat: 'yy-mm-dd',
                minDate: dateToday,
                onSelect: function (dateText, inst) {
                    var selectedDate = jQuery(this).datepicker("getDate");
                    jQuery("#datePicker2").datepicker("option", "minDate", selectedDate);
                }
            });
        });
        jQuery(function () {
            var dateToday = new Date();
            jQuery("#datePicker2").datepicker({
                dateFormat: 'yy-mm-dd',
                minDate: dateToday

            });
        });

        jQuery(function () {
            jQuery('#input_dayStartTime1').timepicker({ 'timeFormat': 'HH:mm:ss', 'scrollbar': true });
            jQuery('#input_dayStartTime1').attr('disabled', 'disabled');
            jQuery('#input_dayStartTime1').val('00:00:00');
        });
        jQuery(function () {
            jQuery('#input_dayEndTime1').timepicker({ 'timeFormat': 'HH:mm:ss', 'scrollbar': true });
            jQuery('#input_dayEndTime1').attr('disabled', 'disabled');
            jQuery('#input_dayEndTime1').val('00:00:00');
        });

        let facilityType = this.facilityDetailForm.controls['facilityType'].value;
        let city = this.facilityDetailForm.controls['city'].value;
        let locality = this.facilityDetailForm.controls['locality'].value;
        let building = this.facilityDetailForm.controls['location'].value;
        let roomName = this.facilityDetailForm.controls['meetingRoomName'].value;
        let noOfSeats = this.facilityDetailForm.controls['numberOfSeats'].value;
        let areaSize = this.facilityDetailForm.controls['areaSize'].value;
        let description = this.facilityDetailForm.controls['description'].value;

        if (facilityType == 0 || city == '' || locality == '' || building == 0 || roomName == '' || noOfSeats == '' || description == '') {
            this.facilityDetailFormError = 'Fill all required fields';
        }
        else if (this.uploadedImages.length < 3) {
            this.facilityDetailFormError = 'Please upload minimum 3 photos.';
        }
        else if (this.selectedAmeninties.length == 0) {

            this.facilityDetailFormError = 'Please select amenities';
        }
        else {
            if (facilityType == "Co-Working Space") {
                this.isOfflineMode = true;
                this.priceDetailForm.controls['costPerHour'].setValue(0);
                this.priceDetailForm.controls['costPerHour'].valueChanges;
                this.priceDetailForm.controls['paymentMethod'].setValue(2);
                this.priceDetailForm.controls['paymentMethod'].valueChanges;
            }
            else {
                this.isOfflineMode = false;
                this.priceDetailForm.controls['paymentMethod'].setValue(1);
                this.priceDetailForm.controls['paymentMethod'].valueChanges;
            }
            this.facilityDetailFormError = '';
            //facility detail data
            this.facilityFormData = this.facilityDetailForm.value;

            this.isFacilityDetailStepShow = false;
            this.isPriceDetailStepShow = true;
            this.isSubmitStepShow = false;
        }



    }
    showSubmitStep() {

        let costPerHour = this.priceDetailForm.controls['costPerHour'].value;
        let costPerDay = this.priceDetailForm.controls['costPerDay'].value;
        let costPerMonth = this.priceDetailForm.controls['costPerMonth'].value;
        let offerDuration = this.priceDetailForm.controls['offerDuration'].value;
        let offerPrice = this.priceDetailForm.controls['offerPrice'].value;

        let paymentMethod = this.priceDetailForm.controls['paymentMethod'].value;
        let spContactNumber = this.priceDetailForm.controls['spContactNumber'].value;
        let spEmail = this.priceDetailForm.controls['spEmail'].value;
        let spAlternateContactNumber = this.priceDetailForm.controls['spAlternateContactNumber'].value;
        let spAlternateEmail = this.priceDetailForm.controls['spAlternateEmail'].value;
        let noOfDaysBefore1 = this.priceDetailForm.controls['noOfDaysBefore1'].value;
        let cancelationCharge1 = this.priceDetailForm.controls['cancelationCharge1'].value;
        let cancelationCharge2 = this.priceDetailForm.controls['cancelationCharge2'].value;
        let cancelationCharge3 = this.priceDetailForm.controls['cancelationCharge3'].value;

        let offerStartdate = jQuery('#datePicker').val();
        let offerEnddate = jQuery('#datePicker2').val();

        if (costPerDay <= 0 || costPerMonth <= 0 || costPerDay == '' || costPerMonth == '') {
            this.priceDetailFormError = 'Please fill pricing details and should be greater than 0';
        }

        else if (!this.showdaysBox) {
            this.priceDetailFormError = 'Please fill all days timings';
        }
        else if (!this.checkDaysValidation()) {
            this.priceDetailFormError = 'Please fill days information.';
        }


        else if (offerPrice > 100) {
            this.priceDetailFormError = 'Offer price should be less than or equal to 100%';
        }
        else if (noOfDaysBefore1 == '' || cancelationCharge1 == '') {
            this.priceDetailFormError = 'Please fill cancellation information.';
        }
        else if ((cancelationCharge1 > 100) || (cancelationCharge2 != '' && cancelationCharge2 > 100) || (cancelationCharge3 != '' && cancelationCharge3 > 100)) {
            this.priceDetailFormError = 'Cancellation charges should be less than or equal to 100%';
        }


        else if (paymentMethod == '') {
            this.priceDetailFormError = 'Please select payment method';
        }
        else if (spContactNumber == '') {
            this.priceDetailFormError = 'Please enter contact details';
        }
        else if (spContactNumber.length != 10) {
            this.priceDetailFormError = 'Please enter 10 digit contact number';
        }
        else if (spAlternateContactNumber.length != 10 && spAlternateContactNumber != '') {
            this.priceDetailFormError = 'Please enter 10 digit alternate contact number';
        }
        else if (!this.isValidEmail(spEmail)) {
            this.priceDetailFormError = 'Enter valid email id';
        }
        else if (!this.isValidEmail(spAlternateEmail) && spAlternateEmail != '') {
            this.priceDetailFormError = 'Enter valid alternate email id';
        }
        else {
            this.priceDetailFormError = '';
            this.isFacilityDetailStepShow = false;
            this.isPriceDetailStepShow = false;
            this.isSubmitStepShow = true;
            //price detail form data
            this.offerStartDate = jQuery("#datePicker").val();
            this.offerEndDate = jQuery("#datePicker2").val();
            this.priceDetailFormData = this.priceDetailForm.value


        }

    }

    getAmenities() {

        this.meetupService.listOfAmenities.forEach(element => {
            let imageIcon = this.domSanitizer.bypassSecurityTrustHtml(element.icon);

            let id = element.id;
            let name = element.name;
            this.amenitiesList.push({ "icon": imageIcon, "id": id, "name": name });
        })
        //this.amenitiesList = this.meetupService.listOfAmenities;
    }

    //upload image code

    thumbnailChange($event): void {
        if (this.uploadedImages.length == 5) {
            this.meetupService.isShowPopup = true;
            this.meetupService.isWarningPopup = true;
            this.meetupService.popupMessage = 'Sorry, you can only upload maximum 5 images.';

        }
        else {
            this.readThumbnail($event.target);
        }
    }

    readThumbnail(inputValue: any): void {
        if (inputValue.files.length == 0) {

        }
        else {
            var file: File = inputValue.files[0];
            this.imagesData.push(inputValue.files[0]);
            if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png') {
                var myReader: FileReader = new FileReader();


                myReader.onloadend = (e) => {
                    this.image = myReader.result.split('base64,');

                    this.previewSrc = {
                        src: "data:image/png;base64," + this.image[1]
                    };
                    this.uploadedImages.push({ 'src': this.previewSrc.src });


                }
                myReader.readAsDataURL(file);
            }
            else {
                this.meetupService.isShowPopup = true;
                this.meetupService.isWarningPopup = true;
                this.meetupService.popupMessage = 'Upload only JPEG,JPG or PNG images';

            }

        }
    }
    uploadThumbnailsToServer(status) {
        this.saveFacilityStatus = status;
        if (this.imagesData.length > 0) {
            this.formSubmitProcessStart = true;

            this.meetupService.uploadThumbnailsToServer(this.imagesData).subscribe(response => {
                let responseCode = response.headers.get('ResponseCode');
                switch (responseCode) {
                    case '2471':
                        let objs = JSON.parse(response.text());

                        objs.forEach(imageData => {
                            this.imagesPathAfterUpload.push({ "imgPath": imageData });
                        })

                        this.addFacility();
                        break;
                    case '2472':
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

                    if (error.status == 500) {
                        this.meetupService.isShowPopup = true;
                        this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'Something went wrong in server';

                    } else {
                        this.meetupService.isShowPopup = true;
                        this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'Something went wrong in server';
                    }
                });
        }
        else {
            this.meetupService.isShowPopup = true;
            this.meetupService.isWarningPopup = true;

            this.meetupService.popupMessage = 'Select files.';

        }
    }
    showAddLocationPopup() {
        this.isShowAddLocationPopup = true;
    }
    closeAddLocationPopup() {
        this.isShowAddLocationPopup = false;
    }
    getFacilities() {

        this.facilitiesList = this.meetupService.listOfFacilityType

    }
    getCities() {

        this.citiesList = this.meetupService.listOfCities;

    }
    getlocalityDataBasedOnSelectedCity() {
        let cityId = this.addLocatioForm.controls['selectCity'].value;
        this.meetupService.getLocalities(cityId).subscribe(res => {
            this.listOfLocalities = res;
        });
    }
    addLocation() {
        this.addLocationProcessStart = true;
        let locationName = this.addLocatioForm.controls['txtName'].value;
        let address = this.addLocatioForm.controls['txtAddress'].value;
        let landmark = this.addLocatioForm.controls['txtLandmark'].value;
        let nearby = this.addLocatioForm.controls['txtNearBy'].value;
        let termsAndConditions = this.addLocatioForm.controls['txtAreaTermsAndConditions'].value;
        let cityid = this.addLocatioForm.controls['selectCity'].value;
        let locality = this.addLocatioForm.controls['selectLocality'].value;

        if (locationName == '' || address == '' || landmark == '' || nearby == '' || termsAndConditions == '' || cityid == '' || locality == '') {
            this.locationAddError = true;
            this.addLocationProcessStart = false;
        }
        else {

            this.locationAddError = false;

            this.meetupService.addLocation(locationName, address, landmark, nearby, termsAndConditions, cityid, locality).subscribe(response => {
                let responseCode = response.headers.get('ResponseCode');
                this.addLocationProcessStart = false;
                if (responseCode == '2411') {
                    this.addLocatioForm.reset();
                    this.readLocations();
                    this.isShowAddLocationPopup = false;
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Location added successfully.';

                }
                else {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Something wrong in server';
                }
            },
                (error) => {

                    if (error.status == 500) {
                        this.meetupService.isShowPopup = true;
                        this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'Something went wrong in server';

                    } else {
                        this.meetupService.isShowPopup = true;
                        this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'Something went wrong in server';
                    }
                });
        }
    }
    selectAmenities(amenitiesId, name, status) {
        //alert(this.selectedAmeninties.find(c => c.amenity.id === amenitiesId));
        if (this.selectedAmeninties.find(c => c.amenity.id === amenitiesId)) {

            let index = this.selectedAmeninties.findIndex(x => x.amenity.id == amenitiesId)
            this.selectedAmeninties.splice(index, 1);
        } else {
            this.selectedAmeninties.push({ "amenity": { "id": amenitiesId }, "description": name });
        }
        //console.log(this.selectedAmeninties);
        //console.log(this.selectedAmeninties.length);
    }

    addDays() {
        this.showdaysBox = !this.showdaysBox;
        this.showExpandIconforAddDays = !this.showExpandIconforAddDays;
    }

    addCancellationRows() {
        this.showCancellationBox = !this.showCancellationBox;
        if (!this.showCancellationBox) {
            this.priceDetailForm.controls['noOfDaysBefore2'].setValue('');
            this.priceDetailForm.controls['cancelationCharge2'].setValue('');
            this.priceDetailForm.controls['noOfDaysBefore3'].setValue('');
            this.priceDetailForm.controls['cancelationCharge3'].setValue('');

        }
        this.showExpandIcon = !this.showExpandIcon;
    }

    createRange(number) {
        var items: number[] = [];
        for (var i = 1; i <= number; i++) {
            let day = i + 1;
            this.priceDetailForm.addControl('day' + day, new FormControl("", Validators.required));
            this.priceDetailForm.addControl('dayStatus' + day, new FormControl("", Validators.required));
            this.priceDetailForm.addControl('dayStartTime' + day, new FormControl("", Validators.required));
            this.priceDetailForm.addControl('dayEndTime' + day, new FormControl("", Validators.required));
            // this.priceDetailForm.controls['dayStartTime' + day].setValue('08:00:00');
            // this.priceDetailForm.controls['dayEndTime' + day].setValue('20:00:00');
            // this.priceDetailForm.controls['dayStartTime' + day].valueChanges;
            // this.priceDetailForm.controls['dayEndTime' + day].valueChanges;
            jQuery(function () {

                jQuery('#input_dayStartTime' + day).timepicker({ 'timeFormat': 'HH:mm:ss', 'scrollbar': true, 'defaultTime': '08:00:00' });
            });
            jQuery(function () {
                jQuery('#input_dayEndTime' + day).timepicker({ 'timeFormat': 'HH:mm:ss', 'scrollbar': true, 'defaultTime': '20:00:00' });
            });


            items.push(i);
        }
        // this.priceDetailForm.controls['dayStatus7'].setValue('0');
        // this.priceDetailForm.controls['dayStatus7'].valueChanges;

        //this.daysStatusChange(1);
        return items;
    }
    fillLocationData() {
        let locationId = this.facilityDetailForm.controls['location'].value;
        let index = this.listOfLocations.findIndex(x => x.id == locationId);

        this.facilityDetailForm.controls['city'].setValue(this.listOfLocations[index].city);
        this.facilityDetailForm.controls['city'].valueChanges;
        this.facilityDetailForm.controls['locality'].setValue(this.listOfLocations[index].localityName);
        this.facilityDetailForm.controls['locality'].valueChanges;
        this.facilityDetailForm.controls['nearby'].setValue(this.listOfLocations[index].nearBy);
        this.facilityDetailForm.controls['nearby'].valueChanges;


    }
    getLocationName(locationId) {

        let index = this.listOfLocations.findIndex(x => x.id == locationId);

        return index >= 0 ? this.listOfLocations[index].locationName : null;
    }
    getFacilityTypeName(facilityTypeId) {
        let index = this.meetupService.listOfFacilityType.findIndex(x => x.id == facilityTypeId);

        return index > 0 ? this.meetupService.listOfFacilityType[index].name : null;
    }
    onlyNumberKey(event) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }
    removeImage(index) {

        this.imagesData.splice(index, 1);
        this.uploadedImages.splice(index, 1);

    }

    checkDaysValidation() {
        let days = 7;
        let errorsArray = [];
        for (var i = 1; i <= days; i++) {
            this.priceDetailForm.controls['dayStartTime' + i].setValue(jQuery('#input_dayStartTime' + i).val());
            this.priceDetailForm.controls['dayEndTime' + i].setValue(jQuery('#input_dayEndTime' + i).val());


            if (this.priceDetailForm.controls['dayStartTime' + i].value == '' || this.priceDetailForm.controls['dayEndTime' + i].value == '') {
                errorsArray.push({ i: false });


            }

        }
        if (errorsArray.length == 0) {
            return true;

        }
        else {
            return false;
        }

    }
    addFacility() {
        this.saveFacilityStatus = false;
        if (this.imagesPathAfterUpload.length > 0) {

            let formData = [];
            let offerdata: any;

            let offerStartdate = this.offerStartDate + ' 00:00:00';
            let offerenddate = this.offerEndDate + ' 00:00:00';

            if (this.priceDetailFormData.offerPrice != '') {
                offerdata = [
                    {
                        "price": this.priceDetailFormData.offerPrice,
                        "startDate": offerStartdate,
                        "endDate": offerenddate
                    }
                ]
            }
            else {
                offerdata = null
            }

            formData.push(this.facilityFormData);
            formData.push(this.priceDetailFormData);

            this.addFacilityProcessStart = true;
            this.meetupService.addFacility(formData, this.imagesPathAfterUpload, offerdata, this.selectedAmeninties, this.gpsData, this.saveFacilityStatus).subscribe(response => {
                this.addFacilityProcessStart = false;

                let responseCode = response.headers.get('ResponseCode');
                switch (responseCode) {
                    case '2111':
                        this.meetupService.isShowPopup = true;
                        this.meetupService.popupMessage = 'Facility added successfully.';

                        this.formSubmitProcessStart = false;
                        this.router.navigate(['service-provider/facility-listing']);
                        break;
                    case '2112':
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

                    if (error.status == 500) {
                        this.meetupService.isShowPopup = true;
                        this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'Something went wrong in server';

                    } else {
                        this.meetupService.isShowPopup = true;
                        this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'Something went wrong in server';
                    }
                });
        }

        else {
            this.meetupService.isShowPopup = true;
            this.meetupService.isWarningPopup = true;
            this.meetupService.popupMessage = 'Images are not yet uploaded';
        }
    }
    daysStatusChange(status) {

        let dayStatus = this.priceDetailForm.controls['dayStatus' + status].value;
        if (dayStatus == 0) {
            this.priceDetailForm.controls['dayStartTime' + status].setValue('00:00:00');
            this.priceDetailForm.controls['dayStartTime' + status].valueChanges;

            this.priceDetailForm.controls['dayEndTime' + status].setValue('00:00:00');
            this.priceDetailForm.controls['dayEndTime' + status].valueChanges;
            jQuery('#input_dayStartTime' + status).attr('disabled', 'disabled');
            jQuery('#input_dayEndTime' + status).attr('disabled', 'disabled');
        }
        else {
            jQuery('#input_dayStartTime' + status).removeAttr('disabled');
            jQuery('#input_dayEndTime' + status).removeAttr('disabled');
        }
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
    savePriceDetailStep() {
        this.errorMszForSave = '';
        let facilitType = this.facilityDetailForm.controls['facilityType'].value;
        let location = this.facilityDetailForm.controls['location'].value;

        if (facilitType == 0) {
            this.errorMszForSave = 'Select Facility Type';
        }
        else if (location == 0) {
            this.errorMszForSave = 'Select Building';
        }
        else {
            if (this.imagesData.length > 0 && this.imagesPathAfterUpload.length == 0) {
                this.meetupService.uploadThumbnailsToServer(this.imagesData).subscribe(response => {
                    let responseCode = response.headers.get('ResponseCode');
                    switch (responseCode) {
                        case '2471':
                            let objs = JSON.parse(response.text());

                            objs.forEach(imageData => {
                                this.imagesPathAfterUpload.push({ "imgPath": imageData });
                            })

                            this.saveFacilityDataAfterUploadImages();
                            break;

                    }


                });
            }
            else {
                this.saveFacilityDataAfterUploadImages();
            }
        }

    }
    saveFacilityDataAfterUploadImages() {
        this.gpsData = jQuery('#input_gps').val().split(',');
        if (this.isPriceDetailStepShow && this.showdaysBox) {
            this.checkDaysValidation();
        }

        let formData = [];
        let offerdata: any;

        let offerStartdate = jQuery('#datePicker').val() + '00:00:00';
        let offerenddate = jQuery('#datePicker2').val() + '00:00:00';
        // alert(this.priceDetailForm.controls['offerPrice'].value);
        if (this.priceDetailForm.controls['offerPrice'].value != '' && this.priceDetailForm.controls['offerPrice'].value != undefined) {
            offerdata = [
                {
                    "price": this.priceDetailForm.controls['offerPrice'].value,
                    "startDate": offerStartdate,
                    "endDate": offerenddate
                }
            ]
        }
        else {
            offerdata = null
        }


        //console.log(formData);
        this.addFacilityProcessStart = true;
        //alert(this.priceDetailForm.controls['paymentMethod'].value);
        if (this.priceDetailForm.controls['paymentMethod'].value == '') {
            if (this.facilityDetailForm.controls['facilityType'].value == "Co-Working Space") {


                this.priceDetailForm.controls['paymentMethod'].setValue(2);
                this.priceDetailForm.controls['paymentMethod'].valueChanges;
            }
            else {

                this.priceDetailForm.controls['paymentMethod'].setValue(1);
                this.priceDetailForm.controls['paymentMethod'].valueChanges;
            }
        }
        //alert(this.priceDetailForm.controls['paymentMethod'].value);
        formData.push(this.facilityDetailForm.value);
        formData.push(this.priceDetailForm.value);
        if (this.savedFacilityId > 0) {

            this.listOfAmenitiessSaved.forEach(amenity => {
                if (this.selectedAmeninties.some(x => x.amenity.id === amenity)) {
                    let index = this.selectedAmeninties.findIndex(x => x.amenity.id == amenity)
                    this.selectedAmeninties.splice(index, 1);
                }
            });

            this.meetupService.updateSavedFacility(formData, this.imagesPathAfterUpload, offerdata, this.selectedAmeninties, this.gpsData, this.saveFacilityStatus, this.savedFacilityId).subscribe(response => {
                let responsecode = response.headers.get('responsecode');

                if (responsecode == '2481') {
                    // this.savedFacilityId = response.headers.get('facilityId');
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Facility updated successfully.';
                    this.showSavedFacilities();
                }
                else if (responsecode == '2482') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Facility update failure.';
                }
            });
        }
        else {
            this.listOfAmenitiessSaved = this.selectedAmeninties;

            this.meetupService.saveFacility(formData, this.imagesPathAfterUpload, offerdata, this.selectedAmeninties, this.gpsData, this.saveFacilityStatus).subscribe(response => {
                let responsecode = response.headers.get('responsecode');

                if (responsecode == '2111') {
                    this.savedFacilityId = response.headers.get('facilityId');
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Facility saved successfully.';
                    this.showSavedFacilities();
                }
                else if (responsecode == '2112') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Facility saved failure.';
                }
            });
        }
    }
    showSavedFacilities() {
        this.meetupService.getSavedFacility().subscribe(response => {
            let responseCode = response.headers.get('ResponseCode');
            if (responseCode == '2121') {
                this.listOfSavedFacilities = JSON.parse(response.text());
                //console.log(this.listOfSavedFacilities);
            }

        });
    }
    goToEditPage(id) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                'from': 'savedFacility'
            }
        };

        this.router.navigate(['/service-provider/edit-facility/' + id], navigationExtras);
    }
    deleteSavedFacility(id) {
        this.meetupService.deleteSavedFacility(id).subscribe(res => {
            let responseCode = res.headers.get('ResponseCode');
            if (responseCode == '2131') {
                this.meetupService.isShowPopup = true;
                this.meetupService.popupMessage = 'Facility deleted successfully.';
                this.showSavedFacilities();
            }
            else if (responseCode == '2132') {
                this.meetupService.isShowPopup = true;
                this.meetupService.isWarningPopup = true;
                this.meetupService.popupMessage = 'Facility deleted failure.';

            }
        });
    }
}

