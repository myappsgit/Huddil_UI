import { Component, AnimationEntryMetadata } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MeetupService } from '../../provider/meetup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// import '../../../assets/js/timepicker.js';
// import '../../../assets/css/timepicker.css';

declare var jQuery: any;


@Component({
    selector: 'edit-facility',
    templateUrl: './edit-facility.component.html',
    styleUrls: ['./edit-facility.component.css']
})
export class EditFacilityComponent {

    facilityDetailForm: FormGroup;
    addLocatioForm: FormGroup;
    priceDetailForm: FormGroup;

    updatePriceForm: FormGroup;

    showCancellationBox;
    isFacilityDetailStepShow = true;
    isPriceDetailStepShow;
    isSubmitStepShow;
    image;
    previewSrc;
    uploadedImages = [];
    imagesData = [];
    isShowAddLocationPopup;
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
    amenitiesList;
    showdaysBox;
    locationAddError;
    addLocationProcessStart: boolean;
    formSubmitProcessStart: boolean;
    showExpandIcon: boolean;
    facilityId;
    facilityDataReady: boolean;
    facilityData;
    showActiveDeactivateContainer;
    showEditContainer;
    showPendingContainer;
    activateDeactivateText;
    facilityAmenities = [];
    facilityAmenitiesList = [];
    activateDeactivateApiBookingMessage: string = '';
    activateDeactivateApiNoBookingMessage: string = '';
    activateDeactivateConfirmResult: string = '';
    isSessionExpired: boolean;
    actideactiError: boolean;
    isOfflineMode: boolean;
    isShowActivateDeactivareBlock: boolean;
    isShowBlockFacilityBlock: boolean;
    blockingfacilityerror: string = '';
    blockingProcessstart;
    showfacilityConfirmButton: boolean;
    isVerifirequest: boolean;
    showBlockedContainer: boolean;

    errorMsg: string = '';
    updatingPriceProcessstart: boolean;
    savedFacilityId: any;

    isPriceDetailsBlock: boolean;
    isSavedFacility: any;
    errorMszForSave: any;
    saveFacilityStatus: boolean;
    gpsData: any = [];

    alreadyUploadedPhotos: any = [];
    newImagesArray: any = [];
    newAmentiesArray: any = [];
    newAmentiesArrayforsave: any = [];

    constructor(public domSanitizer: DomSanitizer, public activateroute: ActivatedRoute, public fb: FormBuilder, public meetupService: MeetupService, public router: Router) {

        this.facilityDetailForm = fb.group({
            facilityType: ['', Validators.required],
            city: ['', Validators.required],
            locality: ['', Validators.required],
            location: ['', Validators.required],
            meetingRoomName: ['', Validators.required],
            numberOfSeats: ['', Validators.required],
            areaSize: ['', Validators.required],
            gps: ['', Validators.required],
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
            costPerHour: ['0', Validators.required],
            costPerDay: ['0', Validators.required],
            costPerMonth: ['0', Validators.required],
            day1: ['', Validators.required],
            dayStatus1: ['1', Validators.required],
            dayStartTime1: ['00:00:00', Validators.required],
            dayEndTime1: ['00:00:00', Validators.required],

            day2: ['', Validators.required],
            dayStatus2: ['1', Validators.required],
            dayStartTime2: ['00:00:00', Validators.required],
            dayEndTime2: ['00:00:00', Validators.required],

            day3: ['', Validators.required],
            dayStatus3: ['1', Validators.required],
            dayStartTime3: ['00:00:00', Validators.required],
            dayEndTime3: ['00:00:00', Validators.required],

            day4: ['', Validators.required],
            dayStatus4: ['1', Validators.required],
            dayStartTime4: ['00:00:00', Validators.required],
            dayEndTime4: ['00:00:00', Validators.required],

            day5: ['', Validators.required],
            dayStatus5: ['1', Validators.required],
            dayStartTime5: ['00:00:00', Validators.required],
            dayEndTime5: ['00:00:00', Validators.required],

            day6: ['', Validators.required],
            dayStatus6: ['1', Validators.required],
            dayStartTime6: ['00:00:00', Validators.required],
            dayEndTime6: ['00:00:00', Validators.required],

            day7: ['', Validators.required],
            dayStatus7: ['1', Validators.required],
            dayStartTime7: ['00:00:00', Validators.required],
            dayEndTime7: ['00:00:00', Validators.required],

            offerDurationStart: ['', Validators.required],
            offerDurationEnd: ['', Validators.required],
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

        this.updatePriceForm = fb.group({
            updateCostPerHour: ['', Validators.required],
            updateCostPerDay: ['', Validators.required],
            updateCostPerMonth: ['', Validators.required]
        })
        this.facilityId = this.activateroute.snapshot.paramMap.get('id');

        this.getFacility();
        this.getCities();
        this.getAmenities();
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
        this.activateroute.queryParams.subscribe(params => {
            if (params != null && params != undefined) {
                this.isSavedFacility = params['from'];
                this.savedFacilityId = this.facilityId;
            }
        });
    }
    getFacility() {
        this.facilityDataReady = false;

        this.meetupService.getfacilityById(this.facilityId).subscribe(response => {
            this.facilityData = JSON.parse(response.text());

            //console.log('facility data' + this.facilityData);
            if (this.facilityData.status == 5 || this.facilityData.status == 7 || this.facilityData.status == 8 || this.facilityData.status == 9 || this.facilityData.status == 10) {
                this.showActiveDeactivateContainer = true;
                //this.showBlockFacilityBlock();
                jQuery('#blockingradio').trigger();
            }
            else if (this.facilityData.status == 3 || this.facilityData.status == 4 || this.isSavedFacility == 'savedFacility') {
                this.showEditContainer = true;
            }
            else if (this.facilityData.status == 1 || this.facilityData.status == 2) {
                this.showPendingContainer = true;
            }
            else if (this.facilityData.status == 11 || this.facilityData.status == 12 || this.facilityData.status == 13 || this.facilityData.status == 14) {
                this.showBlockedContainer = true;
            }

            this.facilityDataReady = true;
            if (this.facilityData.status == 9 || this.facilityData.status == 10) {
                this.activateDeactivateText = 'Activate';
            }
            else {
                this.activateDeactivateText = 'Deactivate';
            }
            this.setValueToFields();
        });



    }
    setValueToFields() {
        this.alreadyUploadedPhotos = this.facilityData.facilityPhotos;
        this.facilityDetailForm.controls['facilityType'].setValue(this.facilityData.facilityType);
        this.facilityDetailForm.controls['facilityType'].valueChanges;

        this.facilityDetailForm.controls['city'].setValue(this.facilityData.city);
        this.facilityDetailForm.controls['city'].valueChanges;

        this.facilityDetailForm.controls['locality'].setValue(this.facilityData.locality);
        this.facilityDetailForm.controls['locality'].valueChanges;

        this.facilityDetailForm.controls['location'].setValue(this.facilityData.location.id);
        this.facilityDetailForm.controls['location'].valueChanges;

        this.facilityDetailForm.controls['meetingRoomName'].setValue(this.facilityData.title);
        this.facilityDetailForm.controls['meetingRoomName'].valueChanges;

        this.facilityDetailForm.controls['numberOfSeats'].setValue(this.facilityData.capacity);
        this.facilityDetailForm.controls['numberOfSeats'].valueChanges;

        this.facilityDetailForm.controls['areaSize'].setValue(this.facilityData.size);
        this.facilityDetailForm.controls['areaSize'].valueChanges;

        this.facilityDetailForm.controls['description'].setValue(this.facilityData.description);
        this.facilityDetailForm.controls['description'].valueChanges;

        this.facilityDetailForm.controls['gps'].setValue(this.facilityData.latitude + ',' + this.facilityData.longtitude);
        this.facilityDetailForm.controls['gps'].valueChanges;

        this.facilityDetailForm.controls['nearby'].setValue(this.facilityData.location.nearBy);
        this.facilityDetailForm.controls['nearby'].valueChanges;
        //pricing details

        this.priceDetailForm.controls['costPerHour'].setValue(this.facilityData.costPerHour);
        this.priceDetailForm.controls['costPerHour'].valueChanges;

        this.priceDetailForm.controls['costPerDay'].setValue(this.facilityData.costPerDay);
        this.priceDetailForm.controls['costPerDay'].valueChanges;

        this.priceDetailForm.controls['costPerMonth'].setValue(this.facilityData.costPerMonth);
        this.priceDetailForm.controls['costPerMonth'].valueChanges;
        if (this.facilityData.facilityOfferses.length > 0) {
            this.priceDetailForm.controls['offerPrice'].setValue(this.facilityData.facilityOfferses[0].price);
            this.priceDetailForm.controls['offerPrice'].valueChanges;

            this.priceDetailForm.controls['offerDurationStart'].setValue(this.facilityData.facilityOfferses[0].startDate);
            this.priceDetailForm.controls['offerDurationStart'].valueChanges;

            this.priceDetailForm.controls['offerDurationEnd'].setValue(this.facilityData.facilityOfferses[0].endDate);
            this.priceDetailForm.controls['offerDurationEnd'].valueChanges;
        }
        this.priceDetailForm.controls['noOfDaysBefore1'].setValue(this.facilityData.facilityCancellationCharges.duration1);
        this.priceDetailForm.controls['noOfDaysBefore1'].valueChanges;

        this.priceDetailForm.controls['noOfDaysBefore2'].setValue(this.facilityData.facilityCancellationCharges.duration2);
        this.priceDetailForm.controls['noOfDaysBefore2'].valueChanges;

        this.priceDetailForm.controls['noOfDaysBefore3'].setValue(this.facilityData.facilityCancellationCharges.duration3);
        this.priceDetailForm.controls['noOfDaysBefore3'].valueChanges;

        this.priceDetailForm.controls['cancelationCharge1'].setValue(this.facilityData.facilityCancellationCharges.percentage1);
        this.priceDetailForm.controls['cancelationCharge1'].valueChanges;

        this.priceDetailForm.controls['cancelationCharge2'].setValue(this.facilityData.facilityCancellationCharges.percentage2);
        this.priceDetailForm.controls['cancelationCharge2'].valueChanges;

        this.priceDetailForm.controls['cancelationCharge3'].setValue(this.facilityData.facilityCancellationCharges.percentage3);
        this.priceDetailForm.controls['cancelationCharge3'].valueChanges;

        this.priceDetailForm.controls['cancelationCharge3'].setValue(this.facilityData.facilityCancellationCharges.percentage3);
        this.priceDetailForm.controls['cancelationCharge3'].valueChanges;

        this.priceDetailForm.controls['spContactNumber'].setValue(this.facilityData.contactNo);
        this.priceDetailForm.controls['spContactNumber'].valueChanges;

        this.priceDetailForm.controls['spEmail'].setValue(this.facilityData.emailId);
        this.priceDetailForm.controls['spEmail'].valueChanges;


        this.priceDetailForm.controls['spAlternateContactNumber'].setValue(this.facilityData.alternateContactNo);
        this.priceDetailForm.controls['spAlternateContactNumber'].valueChanges;

        this.priceDetailForm.controls['spAlternateEmail'].setValue(this.facilityData.alternateEmailId);
        this.priceDetailForm.controls['spAlternateEmail'].valueChanges;

        this.priceDetailForm.controls['paymentMethod'].setValue(this.facilityData.paymnetType);
        this.priceDetailForm.controls['paymentMethod'].valueChanges;

        if (this.facilityData.status == '4') {
            this.priceDetailForm.controls['huddilVerify'].setValue(1);
            this.priceDetailForm.controls['huddilVerify'].valueChanges;
            jQuery('#huddilverifyCheckbox').attr('disabled', 'disabled');
        }


        // this.facilityData.facilityPhotos.forEach(element => {
        //     this.imagesPathAfterUpload.push({ "imgPath": element.imgPath });
        // });





        // set timings
        // this.priceDetailForm.controls['dayStartTime1'].setValue(this.facilityData.facilityTimings[0].openingTime);
        // this.priceDetailForm.controls['dayStartTime1'].valueChanges;

        // this.priceDetailForm.controls['dayEndTime1'].setValue(this.facilityData.facilityTimings[0].closingTime);
        // this.priceDetailForm.controls['dayEndTime1'].valueChanges;





        //load amenities
        this.facilityData.facilityAmenities.forEach(amenitiesData => {
            this.newAmentiesArray.push({ id: amenitiesData.id, faid: amenitiesData.amenity.id });
            this.facilityAmenities.push(amenitiesData.amenity.id);
            this.selectedAmeninties.push({ "amenity": { "id": amenitiesData.amenity.id }, "description": "Not Available" });
        });
        console.log(this.newAmentiesArray);
        this.meetupService.listOfAmenities.forEach(amenitiesData => {

            if (this.facilityAmenities.some(x => x === amenitiesData.id)) {
                this.facilityAmenitiesList.push({ 'status': true, 'id': amenitiesData.id, 'name': amenitiesData.name, 'icon': amenitiesData.icon });
            }
            else {
                this.facilityAmenitiesList.push({ 'status': false, 'id': amenitiesData.id, 'name': amenitiesData.name, 'icon': amenitiesData.icon });
            }

        });
        //get images from server
        this.facilityData.facilityPhotos.forEach(photo => {
            this.meetupService.downloadFacilitiesPhotos(photo.imgPath).subscribe(response => {
                //this.imageText = response.text();
                // this.uploadedImages.push({ 'src': this.imageText });
                this.createImageFromBlob(response, photo.id);

            });
        });

    }
    createImageFromBlob(image: Blob, id) {
        let imageToShow: any;
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            imageToShow = reader.result;
            this.uploadedImages.push({ 'src': imageToShow, 'class': 'previousphoto', 'id': id });
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }


    }
    readLocations() {
        this.meetupService.getLocationBySP().subscribe(response => {
            this.listOfLocations = response
        });
    }

    showFacilityDetailsStep() {
        this.isFacilityDetailStepShow = true;
        this.isPriceDetailStepShow = false;
        this.isSubmitStepShow = false;
    }
    showPriceDetailsStep() {
        console.log(this.alreadyUploadedPhotos);

        this.addDays();
        this.showdaysBox = true;
        // set timings
        for (var i = 1; i <= 7; i++) {
            let index = i - 1;
            this.priceDetailForm.controls['dayStartTime' + i].setValue(this.facilityData.facilityTimings[index].openingTime);
            this.priceDetailForm.controls['dayStartTime' + i].valueChanges;

            this.priceDetailForm.controls['dayEndTime' + i].setValue(this.facilityData.facilityTimings[index].closingTime);
            this.priceDetailForm.controls['dayEndTime' + i].valueChanges;


        }

        jQuery(function () {
            var dateToday = new Date();
            jQuery("#input_fromDate_offer").datepicker({
                dateFormat: 'yy-mm-dd',
                minDate: dateToday
            });
        });
        jQuery(function () {
            var dateToday = new Date();
            jQuery("#input_toDate_offer").datepicker({
                dateFormat: 'yy-mm-dd',
                minDate: dateToday

            });
        });











        // jQuery(function () {
        //     var dateToday = new Date('yy-mm-dd');
        //     jQuery("#input_fromDate_offer").datepicker({
        //         dateFormat: 'yy-mm-dd', minDate: dateToday,
        //         onSelect: function (dateText, inst) {
        //             var selectedDate = jQuery(this).datepicker("getDate");
        //             jQuery("#input_toDate_offer").datepicker("option", "minDate", selectedDate);
        //         }
        //     });
        // });
        // jQuery(function () {
        //     jQuery("#input_toDate_offer").datepicker({ dateFormat: 'yy-mm-dd' });
        // });

        jQuery(function () {
            jQuery('#timeStart1').timepicker({ 'timeFormat': 'HH:mm:ss', 'scrollbar': true });
        });
        jQuery(function () {
            jQuery('#timeEnd1').timepicker({ 'timeFormat': 'HH:mm:ss', 'scrollbar': true });
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
            this.facilityDetailFormError = 'Fill all fields';
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
        if (jQuery('#huddilverifyCheckbox').is(":checked")) {
            this.isVerifirequest = true;
            this.priceDetailForm.controls['huddilVerify'].setValue(1);
            this.priceDetailForm.controls['huddilVerify'].valueChanges;
        }
        else {
            this.priceDetailForm.controls['huddilVerify'].setValue(0);
            this.priceDetailForm.controls['huddilVerify'].valueChanges;
            this.isVerifirequest = false;
        }


        let costPerHour = this.priceDetailForm.controls['costPerHour'].value;

        let costPerDay = this.priceDetailForm.controls['costPerDay'].value;
        let costPerMonth = this.priceDetailForm.controls['costPerMonth'].value;

        let offerPrice = this.priceDetailForm.controls['offerPrice'].value;

        let paymentMethod = this.priceDetailForm.controls['paymentMethod'].value;
        let spContactNumber = this.priceDetailForm.controls['spContactNumber'].value;
        let spEmail = this.priceDetailForm.controls['spEmail'].value;
        let spAlternateContactNumber = this.priceDetailForm.controls['spAlternateContactNumber'].value;
        let spAlternateEmailId = this.priceDetailForm.controls['spAlternateEmail'].value;
        let noOfDaysBefore1 = this.priceDetailForm.controls['noOfDaysBefore1'].value;
        let cancelationCharge1 = this.priceDetailForm.controls['cancelationCharge1'].value;
        let cancelationCharge2 = this.priceDetailForm.controls['cancelationCharge2'].value;
        let cancelationCharge3 = this.priceDetailForm.controls['cancelationCharge3'].value;


        if (costPerDay == 0 || costPerMonth == 0) {

            this.priceDetailFormError = 'Please fill pricing details.';
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
        else if (!this.isValidEmail(spAlternateEmailId) && spAlternateEmailId != '') {
            this.priceDetailFormError = 'Enter valid alternate email id';
        }
        else {
            this.isFacilityDetailStepShow = false;
            this.isPriceDetailStepShow = false;
            this.isSubmitStepShow = true;
            //price detail form data
            this.offerStartDate = jQuery("#input_fromDate_offer").val();
            this.offerEndDate = jQuery("#input_toDate_offer").val();
            this.priceDetailFormData = this.priceDetailForm.value


        }

    }

    getAmenities() {
        this.amenitiesList = this.meetupService.listOfAmenities;
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
                    this.uploadedImages.push({ 'src': this.previewSrc.src, 'class': 'newphoto', 'id': 'new' });


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
    uploadThumbnailsToServer() {
        if (this.imagesData.length > 0) {
            this.formSubmitProcessStart = true;
            this.meetupService.uploadThumbnailsToServer(this.imagesData).subscribe(response => {

                let objs = JSON.parse(response.text());

                objs.forEach(imageData => {
                    this.imagesPathAfterUpload.push({ "imgPath": imageData });
                    this.newImagesArray.push({ imgPath: imageData });

                })

                this.addFacility();

            });
        }
        else {

            this.addFacility();
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

        if (this.selectedAmeninties.find(c => c.amenity.id === amenitiesId)) {

            let index = this.selectedAmeninties.findIndex(x => x == amenitiesId);
            let index2 = this.newAmentiesArray.findIndex(x => x.faid == amenitiesId);
            let val = this.newAmentiesArray[index2].id;
            this.newAmentiesArrayforsave.push({ "id": val, "delete": true });

            this.selectedAmeninties.splice(index, 1);
            // this.newAmentiesArray.splice(index2, 1);


        } else {
            this.selectedAmeninties.push({ "amenity": { "id": amenitiesId }, "description": "Not Available" });
            this.newAmentiesArrayforsave.push({ "amenity": { "id": amenitiesId }, "description": "Not Available" });
        }
        //this.selectedAmeninties = this.selectedAmeninties.concat(this.newAmentiesArray);

        console.log(this.facilityAmenities);
    }

    addDays() {
        this.showdaysBox = !this.showdaysBox;
    }

    addCancellationRows() {
        this.showCancellationBox = !this.showCancellationBox;
        if (!this.showCancellationBox) {
            this.priceDetailForm.controls['noOfDaysBefore2'].setValue('');
            this.priceDetailForm.controls['cancelationCharge2'].setValue('');
            this.priceDetailForm.controls['noOfDaysBefore3'].setValue('');
            this.priceDetailForm.controls['cancelationCharge3'].setValue('');

        }
        this.showExpandIcon = !this.showExpandIcon
    }

    createRange(number) {
        var items: number[] = [];
        for (var i = 1; i <= number; i++) {
            let day = i + 1;

            jQuery(function () {

                jQuery('#timeStart' + day).timepicker({ 'timeFormat': 'HH:mm:ss', 'scrollbar': true });
            });
            jQuery(function () {
                jQuery('#timeEnd' + day).timepicker({ 'timeFormat': 'HH:mm:ss', 'scrollbar': true });
            });
            items.push(i);
        }
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
        let id = this.uploadedImages[index].id;
        if (Number.isInteger(id)) {
            this.uploadedImages.forEach(res => {

                //alert(id);
                if (res.id == id) {
                    this.newImagesArray.push({ id: id, 'delete': true });
                    // alert('delete database image');
                }

            })
        }

        this.imagesData.splice(index, 1);
        this.uploadedImages.splice(index, 1);
        console.log(this.newImagesArray);
    }

    checkDaysValidation() {
        let days = 7;
        let errorsArray = [];
        for (var i = 1; i <= days; i++) {
            this.priceDetailForm.controls['dayStartTime' + i].setValue(jQuery('#timeStart' + i).val());
            this.priceDetailForm.controls['dayEndTime' + i].setValue(jQuery('#timeEnd' + i).val());


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

        let offerdata: any;
        this.isSessionExpired = false;
        if (this.imagesPathAfterUpload.length == 0) {

            this.imagesPathAfterUpload = null
        }
        let offerStartdate = this.offerStartDate + ' 00:00:00';
        let offerenddate = this.offerEndDate + ' 00:00:00';
        let formData = [];

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

        //check amenities changed
        this.facilityAmenities.forEach(amenity => {
            if (this.selectedAmeninties.some(x => x.amenity.id === amenity)) {
                let index = this.selectedAmeninties.findIndex(x => x.amenity.id == amenity)
                this.selectedAmeninties.splice(index, 1);
            }
        });

        this.meetupService.editFacility(this.facilityId, formData, this.newImagesArray, offerdata, this.newAmentiesArrayforsave).subscribe(response => {

            let responseCode = response.headers.get('ResponseCode');
            if (responseCode == '2481') {
                this.meetupService.isShowPopup = true;

                this.meetupService.popupMessage = 'Facility updated successfully.';

                this.formSubmitProcessStart = false;
                this.router.navigate(['service-provider/facility-listing']);

            }
            else if (responseCode == '2482') {
                this.meetupService.isShowPopup = true;
                this.meetupService.isWarningPopup = true;
                this.meetupService.popupMessage = 'Facility updated failure.';

                this.formSubmitProcessStart = false;
                this.router.navigate(['service-provider/facility-listing']);

            }
            else if (responseCode == '9999') {
                if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                    this.isSessionExpired = true;
                    this.meetupService.isInvalidSessionPopupDisplayed = true;
                }
            }
            else {
                if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Unknown error code' + responseCode;
                    this.isSessionExpired = false;
                }
            }
        },
            (error) => {
                this.formSubmitProcessStart = false;
                if (error.status == 500) {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Internal server error';

                } else {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Something went wrong in server';

                }
            });

    }
    daysStatusChange(status) {
        let dayStatus = this.priceDetailForm.controls['dayStatus' + status].value;
        if (dayStatus == 0) {
            this.priceDetailForm.controls['dayStartTime' + status].setValue('00:00:00');
            this.priceDetailForm.controls['dayStartTime' + status].valueChanges;

            this.priceDetailForm.controls['dayEndTime' + status].setValue('00:00:00');
            this.priceDetailForm.controls['dayEndTime' + status].valueChanges;
            jQuery('#timeStart' + status).attr('disabled', 'disabled');
            jQuery('#timeEnd' + status).attr('disabled', 'disabled');
        }
        else {
            jQuery('#timeStart' + status).removeAttr('disabled');
            jQuery('#timeEnd' + status).removeAttr('disabled');
        }
    }
    activateDeactivateFacility(confirm) {
        let comment = ''
        let status: number;


        if (this.facilityData.status == 9 || this.facilityData.status == 10) {
            status = 1;
            comment = 'for activation';
            confirm = 0;
        }
        else {
            comment = jQuery('#deactivationReason').val();
            status = 0;
        }

        if (comment == undefined || comment == '') {
            this.actideactiError = true;
        }
        else {
            this.actideactiError = false;
            this.showfacilityConfirmButton = false;
            this.meetupService.updateFacilityStatusBySP(comment, this.facilityId, status, confirm).subscribe(response => {
                let responseCode = response.headers.get('ResponseCode');
                if (responseCode == '2514') {
                    this.showfacilityConfirmButton = true;
                    this.activateDeactivateApiNoBookingMessage = 'Future booking will not be available for this facility. Click confirm to proceed.';
                }
                else if (responseCode == '2513') {
                    this.showfacilityConfirmButton = true;
                    this.activateDeactivateApiBookingMessage = 'There are some bookings for this facility. Are you sure want to proceed.';
                }
                else if (responseCode == '3100') {
                    this.activateDeactivateApiBookingMessage = 'Cancel booking failed.';
                }
                else if (responseCode == '2341') {
                    this.activateDeactivateConfirmResult = status == 1 ? 'Activated successfully' : 'Deactivated successfully';
                    this.meetupService.isShowPopup = true;

                    this.meetupService.popupMessage = this.activateDeactivateConfirmResult;


                    //window.location.reload();
                }
                else if (responseCode == '2342') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'There is some technical problem. Please contact administrator.';

                }
                else if (responseCode == '9999') {
                    if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                        this.meetupService.isShowPopup = true;
                        this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'Your session has expired. Please login again.';
                        this.isSessionExpired = true;
                        this.meetupService.isInvalidSessionPopupDisplayed = true;
                    }
                }
                else {
                    if (!this.meetupService.isInvalidSessionPopupDisplayed) {

                        this.meetupService.isShowPopup = true;
                        this.meetupService.isWarningPopup = true;
                        this.meetupService.popupMessage = 'Unknown error code' + responseCode;
                        this.isSessionExpired = false;
                    }
                }

            });
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
            if (this.isSavedFacility != 'savedFacility' || this.isSavedFacility == null || this.isSavedFacility == '') {

                this.router.navigate(['/service-provider/facility-detail/' + this.facilityId]);
            }
        }

    }

    showActideactiBlocks() {
        this.isShowActivateDeactivareBlock = true;
        this.isShowBlockFacilityBlock = false;
        this.isPriceDetailsBlock = false;
    }
    showBlockFacilityBlock() {

        jQuery(function () {
            var dateToday = new Date();
            jQuery('#blockDateStart').datetimepicker({
                format: 'Y-m-d H:i:00',
                todayHighlight: true,
                minDate: dateToday,

            });

        });
        jQuery(function () {
            var dateToday = new Date();

            jQuery('#blockDateEnd').datetimepicker({
                format: 'Y-m-d H:i:00',
                minDate: dateToday
            });
        });

        this.isShowBlockFacilityBlock = true;
        this.isShowActivateDeactivareBlock = false;
        this.isPriceDetailsBlock = false;
    }

    showBlockPriceDetails() {

        this.isShowBlockFacilityBlock = false;
        this.isShowActivateDeactivareBlock = false;
        this.isPriceDetailsBlock = true;

        this.updatePriceForm.controls['updateCostPerHour'].setValue(this.facilityData.costPerHour);
        this.updatePriceForm.controls['updateCostPerHour'].valueChanges;

        this.updatePriceForm.controls['updateCostPerDay'].setValue(this.facilityData.costPerDay);
        this.updatePriceForm.controls['updateCostPerDay'].valueChanges;

        this.updatePriceForm.controls['updateCostPerMonth'].setValue(this.facilityData.costPerMonth);
        this.updatePriceForm.controls['updateCostPerMonth'].valueChanges;
    }
    updatePriceDetails() {
        this.updatingPriceProcessstart = true;

        let costPerHour = this.updatePriceForm.controls['updateCostPerHour'].value;
        let costPerDay = this.updatePriceForm.controls['updateCostPerDay'].value;
        let costPerMonth = this.updatePriceForm.controls['updateCostPerMonth'].value;
        //console.log('per hour' + costPerHour, 'per day' + costPerDay, 'per month' + costPerMonth);
        if (+costPerHour > +costPerDay) {
            this.updatingPriceProcessstart = false;
            this.errorMsg = 'Cost per day should be greater then cost per hour.'
        }
        else if (+costPerDay > +costPerMonth) {
            this.updatingPriceProcessstart = false;
            this.errorMsg = 'Cost per month should be greater then cost per day.'
        }
        else if (+costPerHour > +costPerMonth) {
            this.updatingPriceProcessstart = false;
            this.errorMsg = 'Cost per month should be greater then cost per hour.'
        }
        else if (costPerHour == "" && costPerDay == "" && costPerMonth == "") {
            this.updatingPriceProcessstart = false;
            this.errorMsg = 'Please enter price details'
        }
        else {
            this.meetupService.updatefacilityPriceDetails(this.facilityId, costPerDay, costPerHour, costPerMonth).subscribe(res => {
                this.updatingPriceProcessstart = false;
                let responseCode = res.headers.get('ResponseCode');

                switch (responseCode) {
                    case '2483':
                        this.meetupService.isShowPopup = true;
                        this.meetupService.popupMessage = 'Facility Price Update Successful';
                        this.errorMsg = ''
                        break;
                    case '2484':
                        this.errorMsg = 'Facility Price Update failure'
                        break;
                    case '9996':
                        this.errorMsg = 'User is not allowed to perform this action'
                        break;
                    case '9999':
                        this.errorMsg = 'Invalid session id'
                        break;

                }

            },
                (error) => {

                    if (error.status == 500) {
                        this.errorMsg = 'Internal server error';


                    } else {
                        this.errorMsg = 'Something went wrong in server.';


                    }
                })

        }

    }

    hideActideactiBlocks() {
        this.router.navigate(['/service-provider/facility-detail/' + this.facilityId]);
        // jQuery('#actiradio').removeAttr('checked');
        // this.isShowActivateDeactivareBlock = false;
    }
    hideBlockingBlocks() {
        this.router.navigate(['/service-provider/facility-detail/' + this.facilityId]);
        // jQuery('#blockDateStart').val('');
        // jQuery('#blockDateEnd').val('');
        // jQuery('#coworkingSeats').val('');
        // jQuery('#blockingReason').val('');
        // jQuery('#blockingradio').removeAttr('checked');
        // this.isShowBlockFacilityBlock = false;
    }
    blockFacility() {
        this.blockingfacilityerror = '';
        let startDate = jQuery('#blockDateStart').val();
        let endDate = jQuery('#blockDateEnd').val();
        let seats = jQuery('#coworkingSeats').val();

        let redirectUrl = 'http://';
        if (startDate == '' || endDate == '') {
            this.blockingfacilityerror = 'Fill all required data';
        }
        else if (this.facilityData.facilityType == 'Co-Working Space' && seats == '') {
            this.blockingfacilityerror = 'Enter seats';
        }
        else if (this.facilityData.facilityType == 'Co-Working Space' && seats == '0') {
            this.blockingfacilityerror = 'Seats should be non zero';
        }
        else {
            this.blockingfacilityerror = '';
            this.blockingProcessstart = true;
            this.meetupService.createBooking(startDate, endDate, seats, this.facilityData.id, 'offline', redirectUrl).subscribe(response => {

                this.blockingProcessstart = false;

                switch (response.responseCode) {
                    case '3000':
                        this.blockingfacilityerror = 'From time is after to time';
                        break;
                    case '3003':
                        this.blockingfacilityerror = 'Invalid facility id';
                        break;
                    case '3004':
                        this.blockingfacilityerror = 'Facility not available for booking';
                        break;
                    case '3005':
                        this.blockingfacilityerror = 'Facility is under maintenance';
                        break;
                    case '3006':
                        this.blockingfacilityerror = 'Booking start time is before facility opening time';
                        break;
                    case '3007':
                        this.blockingfacilityerror = 'Booking end time is after facility closing time';
                        break;
                    case '3008':
                        this.blockingfacilityerror = 'Facility does not have enough seats';
                        break;
                    case '3020':
                        this.blockingfacilityerror = 'Seats should be non zero';
                        break;
                    case '3009':
                        //this.bookingErrorMessage = 'Facility have enough seats'; for coworking
                        this.meetupService.isShowPopup = true;
                        this.meetupService.popupMessage = 'Blocked successfully for the provided time slot.';
                        this.blockingfacilityerror = '';

                        break;
                    case '3010':
                        this.blockingfacilityerror = 'Already booking exist for the time specified';
                        break;
                    case '3014':
                        this.meetupService.isShowPopup = true;
                        this.meetupService.popupMessage = 'Blocked successfully for the provided time slot.';
                        this.blockingfacilityerror = '';
                        break;
                    case '3016':
                        this.meetupService.isShowPopup = true;
                        this.meetupService.popupMessage = 'Blocked successfully for the provided time slot.';
                        this.blockingfacilityerror = '';
                        break;
                    case '3019':
                        this.blockingfacilityerror = 'Invalid timing.';
                        break;
                    case '9996':
                        this.blockingfacilityerror = 'User is not allowed to perform this action';
                        break;
                    case '9999':
                        this.blockingfacilityerror = 'Session invalid/ does not exist';
                        break;


                }
            });
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
                                this.newImagesArray.push({ "imgPath": imageData });
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

        formData.push(this.facilityDetailForm.value);
        formData.push(this.priceDetailForm.value);
        //console.log(formData);

        if (this.savedFacilityId > 0) {
            this.meetupService.updateSavedFacility(formData, this.newImagesArray, offerdata, this.newAmentiesArrayforsave, this.gpsData, this.saveFacilityStatus, this.savedFacilityId).subscribe(response => {
                let responsecode = response.headers.get('responsecode');

                if (responsecode == '2481') {
                    this.savedFacilityId = response.headers.get('facilityId');
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Facility updated successfully.';

                }
                else if (responsecode == '2482') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Facility update failure.';
                }
            });
        }
        else {
            this.meetupService.saveFacility(formData, this.newImagesArray, offerdata, this.newAmentiesArrayforsave, this.gpsData, this.saveFacilityStatus).subscribe(response => {
                let responsecode = response.headers.get('responsecode');

                if (responsecode == '2111') {
                    this.savedFacilityId = response.headers.get('facilityId');
                    this.meetupService.isShowPopup = true;
                    this.meetupService.popupMessage = 'Facility saved successfully.';

                }
                else if (responsecode == '2112') {
                    this.meetupService.isShowPopup = true;
                    this.meetupService.isWarningPopup = true;
                    this.meetupService.popupMessage = 'Facility saved failure.';
                }
            });
        }
    }

}
