import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { Subject } from 'rxjs/Subject';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PlatformLocation } from '@angular/common';


@Injectable()
export class MeetupService {
    //login apps keys
    public facebookAppKey: string = '334788613700258';
    public googleSecretKey: string = '132502553552-pkkvs5f6dbhvhu4b2dnn7fbpfleo8595.apps.googleusercontent.com';

    public isUserLoggedInWithFacebook: boolean;
    public isUserLoggedInWithGoogle: boolean;
    public usertype: any;
    public isLoggedIn: boolean;
    public redirectUrl: any;
    public sessionId = null;
    public isMobileNumberPopupForConsumer: boolean;
    googleSignUpChange: Subject<boolean> = new Subject<boolean>();
    googleuserdata: any = [];

    //list of cities, facilitiy types, facility status

    public listOfCities = [];
    public listOfFacilityType = [];
    public listOfFacilityStatus = [];
    public listOfAmenities = [];

    public consumerTermsId: number;
    public SPTermsId: number;
    public consumerTermstext: any;
    public SPTermsText: any;


    public previousUrl: any;
    public upcomingBookingDetails: any;

    public isLoginPopUp: boolean;
    //common data
    public listOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // urls
    baseUrl: any;
    originurl: any;
    productName = 'huddil';
    public userDetails: any = [];
    public isInternetWorking = navigator.onLine;
    public isShowPopup: boolean = false;
    public isWarningPopup: boolean;
    public popupMessage: string = '';
    public isInvalidSessionPopupDisplayed: boolean;


    //calendar popup variables

    isShowCalendarPopup: boolean;
    facilityIdForCalendar: any;
    facilityTitleForCalendar: any;
    isShowHowItWorksPopup: boolean;

    isShowConsumerTCPSPopup: boolean;
    isShowSPTCPSPopup: boolean;

    costFormErrorMessage1: string;
    calculateCost: any = [];
    IsAvailableForBooking: boolean;

    calculateCostfacilityId: any;
    seatsForcalculateCost: number = 0;

    facebooktoken: any;
    facebookUserName: any;
    facebookUserEmailId: any;
    consumerUserData: any = [];
    currentPaginationPage: number = 1;
    totalRecordsPagination: number = 0;
    spPreviousURL: any = '';
    isShowTCPSLoginPopUp: boolean;
    isAvailableLatestTCPS: boolean;
    isCallNowPopUp: boolean;
    isTermsAndConditionExistForSP: boolean;

    wrapper_baseUrl: String;
    huddil_baseUrl: string;
    constructor(private http: Http, public platformLocation: PlatformLocation, public router: Router, public domSanitizer: DomSanitizer) {
        this.googleSignUpChange.subscribe((value) => {
            this.isMobileNumberPopupForConsumer = value
        });
        //local 
        // this.wrapper_baseUrl = 'http://192.168.2.103:9191/wrapper-1.0.7-BUILD-SNAPSHOT/';
        // this.huddil_baseUrl = 'http://192.168.2.103:9191/huddil-1.0.7-BUILD-SNAPSHOT/';

        //global primary
        //this.wrapper_baseUrl = 'http://106.51.75.39:9090/wrapper-1.0.0-BUILD-SNAPSHOT/';
        //this.huddil_baseUrl = 'http://106.51.75.39:9090/huddil-1.0.0-BUILD-SNAPSHOT/';

        //global cloud 
        // this.wrapper_baseUrl = 'https://ec2-18-216-216-162.us-east-2.compute.amazonaws.com:8443/wrapper-1.0.7-BUILD-SNAPSHOT/';
        // this.huddil_baseUrl = 'https://ec2-18-216-216-162.us-east-2.compute.amazonaws.com:8443/huddil-1.0.7-BUILD-SNAPSHOT/';

        //global cloud 9th build
        //this.wrapper_baseUrl = 'http://ec2-18-216-216-162.us-east-2.compute.amazonaws.com:8080/wrapper-1.0.9Beta-BUILD-SNAPSHOT/';
        //this.huddil_baseUrl = 'http://ec2-18-216-216-162.us-east-2.compute.amazonaws.com:8080/huddil-1.0.9Beta-BUILD-SNAPSHOT/';


        //global primary for testing
        //this.wrapper_baseUrl = 'http://106.51.75.39:9191/wrapper-1.0.0-BUILD-SNAPSHOT/';
        //this.huddil_baseUrl = 'http://106.51.75.39:9191/huddil-1.0.0-BUILD-SNAPSHOT/';

        //global secondary
        //this.wrapper_baseUrl = 'http://122.166.181.67:9191/wrapper-1.0.5-BUILD-SNAPSHOT/';
        //this.huddil_baseUrl = 'http://122.166.181.67:9191/huddil-1.0.5-BUILD-SNAPSHOT/';

        //cloud

        //this.wrapper_baseUrl = 'https://52.15.86.32:8443/wrapper-1.0.9Beta-BUILD-SNAPSHOT/';
        //this.huddil_baseUrl = 'https://52.15.86.32:8443/huddil-1.0.9Beta-BUILD-SNAPSHOT/';

        //Added on 20.2.2018 Tuesday
        //this.wrapper_baseUrl = 'http://52.15.86.32:8080/wrapper-1.1.0/';
        //this.huddil_baseUrl = 'http://52.15.86.32:8080/huddil-1.1.0/';
        //Added on 20.2.2018 Tuesday
        this.wrapper_baseUrl = 'http://ec2-18-219-72-56.us-east-2.compute.amazonaws.com:8080/wrapper-1.0.11.war/';
        this.huddil_baseUrl = 'http://ec2-18-219-72-56.us-east-2.compute.amazonaws.com:8080/huddil-1.0.12.war/';
        //Test Server http://192.168.1.26:9191
        //this.wrapper_baseUrl = 'http://192.168.1.26:9191/wrapper-1.0.0-BUILD-SNAPSHOT/';
        //this.huddil_baseUrl = 'http://192.168.1.26:9191/huddil-1.0.0-BUILD-SNAPSHOT/';

        //test server http://192.168.1.48.9191
        //this.wrapper_baseUrl = 'http://192.168.1.48:9191/wrapper-1.0.0-BUILD-SNAPSHOT/';
        //this.huddil_baseUrl = 'http://192.168.1.48:9191/huddil-1.0.0-BUILD-SNAPSHOT/';

        let protocol = location.protocol;
        //this.baseUrl = protocol + '//localhost:4200/';
        this.baseUrl = protocol + '//ec2-13-126-165-2.ap-south-1.compute.amazonaws.com';
        //this.baseUrl = protocol + '//huddil.com/';

        this.originurl = (platformLocation as any).location.origin;
    }
    //login and registration !!! account activation-----------------


    forceLogoutWithoutSessionId() {
        sessionStorage.clear();
        localStorage.clear();
        this.isLoggedIn = false;

    }
    login(username, password) {
        let body = {
            "salt": username,
            "password": password,
            "product": "huddil"
        };
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');


        return this.http.post(this.wrapper_baseUrl + 'auth/',
            JSON.stringify(body), { headers: headers });

    }
    signup(name, email, mobile, password, redirectUrl) {

        let body = {
            "emailId": email,
            "mobileNo": mobile,
            "authorization": {
                "password": btoa(password)
            },
            "termsConditionsHistories": [
                {
                    "termsConditions": {
                        "id": this.consumerTermsId
                    }
                }
            ],
            "addressingName": name,
            "product": "huddil",
            "userType": "consumer"
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "usrDts/?redirectUrl=" + redirectUrl, JSON.stringify(body), { headers: headers });
    }


    activateAccountByEmailLink(email, token) {

        return this.http.put(this.wrapper_baseUrl + "accountActivationThroughEmail/?emailId=" + email + "&token=" + token + "&product=" + this.productName, '');

    }

    deleteAccountByEmailLink(email, token) {
        return this.http.delete(this.wrapper_baseUrl + "deleteUserAccountThroughMail/?emailId=" + email + "&token=" + token + "&product=" + this.productName);

    }
    signupForSP(ownerName, email, mobile, website, address, state, city, pincode, country, password, redirectUrl) {


        let body = {
            "addressingName": ownerName,
            "emailId": email,
            "mobileNo": mobile,
            "website": website,
            "address": address,
            "state": state,
            "city": city,
            "pincode": pincode,
            "country": country,
            "authorization": {
                "password": btoa(password),
            },
            "termsConditionsHistories": [
                {
                    "termsConditions": {
                        "id": this.SPTermsId
                    }
                }
            ],
            "product": "huddil",
            "userType": "service provider",
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "usrDts/?redirectUrl=" + redirectUrl, JSON.stringify(body), { headers: headers });
    }
    logout() {

        return this.http.put(this.wrapper_baseUrl + "logout/?sessionId=" + this.sessionId + "&product=huddil", '');
    }
    getTermsAndConditionsForConsumer() {
        this.http.get(this.wrapper_baseUrl + 'termsAndConditionsHistory/?userType=consumer&product=huddil').map(res => res.json()).subscribe(response => {
            this.consumerTermsId = response.id;


            this.consumerTermstext = this.domSanitizer.bypassSecurityTrustHtml(response.description);
            sessionStorage.setItem('consumerTermsData', this.consumerTermstext);
        });

    }
    getTermsAndConditionsForSP() {

        this.http.get(this.wrapper_baseUrl + 'termsAndConditionsHistory/?userType=service provider&product=huddil').map(res => res.json()).subscribe(response => {
            this.SPTermsId = response.id;
            this.SPTermsText = this.domSanitizer.bypassSecurityTrustHtml(response.description);

        });
    }
    getUserDetails() {
        return this.http.get(this.wrapper_baseUrl + 'usrDts/' + this.sessionId).map(res => res.json());
    }

    //common apis

    getLeastCost() {
        return this.http.get(this.huddil_baseUrl + 'leastCost/').map(res => res.json());
    }

    getCity() {
        this.http.get(this.huddil_baseUrl + 'city/').map(res => res.json()).subscribe(response => {
            this.listOfCities = response;
        });
    }
    getLocalities(id) {
        return this.http.get(this.huddil_baseUrl + 'localities/' + id).map(res => res.json());
    }
    getFacilityType() {
        return this.http.get(this.huddil_baseUrl + 'facilityType/').map(res => res.json()).subscribe(response => {
            this.listOfFacilityType = response;
        });
    }
    getAmenities() {
        this.listOfAmenities = [];
        return this.http.get(this.huddil_baseUrl + 'amenity/').map(res => res.json()).subscribe(response => {
            response.forEach(element => {
                let imageIcon = this.domSanitizer.bypassSecurityTrustHtml(element.icon);
                let id = element.id;
                let name = element.name;
                this.listOfAmenities.push({ "icon": imageIcon, "id": id, "name": name });
            });


        });
    }
    getState() {

        return this.http.get(this.wrapper_baseUrl + 'stateList/').map(res => res.json());
    }
    getCityName(cityId) {

        let index = this.listOfCities.findIndex(x => x.id == cityId);

        return index > 0 ? this.listOfCities[index].name : cityId;
    }
    getFacilityTypeName(facilityTypeId) {
        let index = this.listOfFacilityType.findIndex(x => x.id == facilityTypeId);

        return index > 0 ? this.listOfFacilityType[index].name : null;
    }
    changePassword(currentPassword, newPassword, confirmNewPassword) {
        let body = {
            "oldPassword": btoa(currentPassword),
            "newPassword": btoa(newPassword),
            "confirmPassword": btoa(confirmNewPassword)
        };

        return this.http.put(this.wrapper_baseUrl + "changePassword/" + this.sessionId, body);
    }
    adminChangePassword(currentPassword, newPassword, confirmNewPassword, sessionId) {
        let body = {
            "oldPassword": btoa(currentPassword),
            "newPassword": btoa(newPassword),
            "confirmPassword": btoa(confirmNewPassword)
        };

        return this.http.put(this.wrapper_baseUrl + "changePassword/" + sessionId, body);
    }
    updateUsersTCPS() {
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser.userType == '7') {
            return this.http.put(this.wrapper_baseUrl + "termsAndConditionsHistory/" + this.sessionId + '/' + this.SPTermsId, '');
        }
        else if (currentUser.userType == '8') {
            return this.http.put(this.wrapper_baseUrl + "termsAndConditionsHistory/" + this.sessionId + '/' + this.consumerTermsId, '');

        }
    }

    //service provider

    getOffersDetails(facilityId) {
        console.log(this.huddil_baseUrl + "/facilityOffer/" + this.sessionId + "/" + facilityId);
        return this.http.get(this.huddil_baseUrl + "facilityOffer/" + this.sessionId + "/" + facilityId)
    }
    getSavedFacility() {
        return this.http.get(this.huddil_baseUrl + 'savedFacility/?sessionId=' + this.sessionId);
    }
    updatefacilityPriceDetails(facilityId, costPerDay, costPerHour, costPerMonth) {
        return this.http.put(this.huddil_baseUrl + 'updateFacilityPrice?sessionId=' + this.sessionId + '&facilityId=' + facilityId + '&costPerDay=' + costPerDay + '&costPerHour=' + costPerHour + '&costPerMonth=' + costPerMonth, '')
    }

    getPaymentReport(month, year) {

        return this.http.get(this.huddil_baseUrl + 'paymentReport/?sessionId=' + this.sessionId + '&month=' + month + '&year=' + year);
    }
    getFacilityData(pageno, count) {
        return this.http.get(this.huddil_baseUrl + 'facilities/?sessionId=' + this.sessionId + '&fromTime=1970-11-11%2010:00:00&toTime=1970-11-11%2010:00:00&pageNo=' + pageno + '&count=' + count);
    }

    getFacilitiesByFilters(cityId, locality, location, typeId, status, searchTitle, pageno, count) {
        return this.http.get(this.huddil_baseUrl + 'filterFacility?sessionId=' + this.sessionId + '&cityId=' + cityId + '&localityId=' + locality + '&locationId=' + location + '&typeId=' + typeId + '&status=' + status + '&search=' + searchTitle + '&pageNo=' + pageno + '&count=' + count);
    }
    getCountOfFacilitiesStatus() {
        return this.http.get(this.huddil_baseUrl + 'facilityStatusBySP/' + this.sessionId);

    }
    uploadThumbnailsToServer(thumbnails) {
        let headers = new Headers();
        let formData: FormData = new FormData();
        thumbnails.forEach(imageData => {
            formData.append("inputFile", imageData, imageData.name);
        });

        return this.http.post(this.huddil_baseUrl + "fileupload/", formData, { headers: headers });
    }
    getfacilityById(facilityId) {
        return this.http.get(this.huddil_baseUrl + "facility/?sessionId=" + this.sessionId + "&id=" + facilityId);
    }

    addLocation(name, address, landmark, nearBy, termsAndConditions, cityId, localityId) {
        let body = {
            "name": name,
            "address": address,
            "landmark": landmark,
            "nearBy": nearBy,
            "facilityTermsConditionses": [
                {
                    "description": termsAndConditions,
                    //  "status":"1",
                    //  "createdDate":"2018-03-03"
                }
            ],
            "city": {
                "id": cityId
            },
            "locality": {
                "id": localityId
            }
        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(body));
        return this.http.post(this.huddil_baseUrl + "location/" + this.sessionId, JSON.stringify(body), { headers: headers });
    }

    addOfferDetails(facilityId, offerStartDate, offerEndDate, OfferValue) {

        let body = {
            "facility": {
                "id": facilityId
            },
            "startDate": offerStartDate,
            "endDate": offerEndDate,
            "price": OfferValue
        }
        console.log(this.huddil_baseUrl + "offer/" + this.sessionId);
        console.log(JSON.stringify(body));
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        return this.http.post(this.huddil_baseUrl + "offer/" + this.sessionId, JSON.stringify(body), { headers: headers });

    }

    getLocationBySP() {
        return this.http.get(this.huddil_baseUrl + "getLocationBySP/" + this.sessionId)
            .map(res => res.json());
    }
    getSPBookings(cityId, localityId, month, bookingStatus, facilityTypeId, pageNo, count) {
        return this.http.get(this.huddil_baseUrl + "bookings?sessionId=" + this.sessionId + "&cityId=" + cityId + "&localityId=" + localityId + "&month=" + month + "&status=" + bookingStatus + "&typeId=" + facilityTypeId + "&pageNo=" + pageNo + "&count=" + count);
    }
    getBookingById(bookingId) {
        return this.http.get(this.huddil_baseUrl + "booking/?bookingId=" + bookingId + "&sessionId=" + this.sessionId);
    }
    getCompletedBookingById(bookingId) {
        return this.http.get(this.huddil_baseUrl + "getCompletedBookingDetailsBySP/?id=" + bookingId + "&sessionId=" + this.sessionId);
    }
    getCancelledBookingById(bookingId) {
        return this.http.get(this.huddil_baseUrl + "getCancellationDetailsBySP/?id=" + bookingId + "&sessionId=" + this.sessionId);
    }

    getRevenue(month, status, year) {
        return this.http.get(this.huddil_baseUrl + "filterRevenue/?sessionId=" + this.sessionId + "&month=" + month + "&facilityType=0&selection=" + status + '&year=' + year);
    }
    getPaymentHistory(cityId, localityId, type, month, status) {
        return this.http.get(this.huddil_baseUrl + "paymentReport/?sessionId=" + this.sessionId + "&cityId=" + cityId + "&localityId=" + localityId + "&typeId=" + type + "&month=" + month + "&selection=" + status);
    }

    addFacility(facilityData, images, offerdata, selectedAmeninties, gpsdata, saveFacilityStatus) {
        let isSave = saveFacilityStatus == 0 ? true : false;
        let body = {
            "facilityType": facilityData[0].facilityType,
            "location": {
                "id": facilityData[0].location
            },
            "huddleVerified": facilityData[1].huddilVerify == true ? 1 : 0,
            "emailId": facilityData[1].spEmail,
            "alternateEmailId": facilityData[1].spAlternateEmail,
            "title": facilityData[0].meetingRoomName,
            "description": facilityData[0].description,
            "capacity": facilityData[0].numberOfSeats,
            "latitude": gpsdata[0],
            "longtitude": gpsdata[1],
            "costPerHour": facilityData[1].costPerHour,
            "costPerDay": facilityData[1].costPerDay,
            "costPerMonth": facilityData[1].costPerMonth,
            "size": facilityData[0].areaSize,
            "contactNo": facilityData[1].spContactNumber,
            "alternateContactNo": facilityData[1].spAlternateContactNumber,
            "paymnetType": facilityData[1].paymentMethod,
            "facilityCancellationCharges": {
                "duration1": facilityData[1].noOfDaysBefore1,
                "percentage1": facilityData[1].cancelationCharge1,
                "duration2": facilityData[1].noOfDaysBefore2 != '' ? facilityData[1].noOfDaysBefore2 : 0,
                "percentage2": facilityData[1].cancelationCharge2 != '' ? facilityData[1].cancelationCharge2 : 0,
                "duration3": facilityData[1].noOfDaysBefore3 != '' ? facilityData[1].noOfDaysBefore3 : 0,
                "percentage3": facilityData[1].cancelationCharge3 != '' ? facilityData[1].cancelationCharge3 : 0
            },
            "facilityAmenities": selectedAmeninties,
            "facilityPhotos": images,
            "facilityTimings": [
                {
                    "weekDay": 1,
                    "openingTime": facilityData[1].dayStartTime1,
                    "closingTime": facilityData[1].dayEndTime1
                },
                {
                    "weekDay": 2,
                    "openingTime": facilityData[1].dayStartTime2,
                    "closingTime": facilityData[1].dayEndTime2
                },
                {
                    "weekDay": 3,
                    "openingTime": facilityData[1].dayStartTime3,
                    "closingTime": facilityData[1].dayEndTime3
                },
                {
                    "weekDay": 4,
                    "openingTime": facilityData[1].dayStartTime4,
                    "closingTime": facilityData[1].dayEndTime4
                },
                {
                    "weekDay": 5,
                    "openingTime": facilityData[1].dayStartTime5,
                    "closingTime": facilityData[1].dayEndTime5
                },
                {
                    "weekDay": 6,
                    "openingTime": facilityData[1].dayStartTime6,
                    "closingTime": facilityData[1].dayEndTime6
                },
                {
                    "weekDay": 7,
                    "openingTime": facilityData[1].dayStartTime7,
                    "closingTime": facilityData[1].dayEndTime7
                }

            ],

            "facilityOfferses": offerdata

        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(body));
        return this.http.post(this.huddil_baseUrl + "facility/?sessionId=" + this.sessionId + "&save=" + isSave, JSON.stringify(body), { headers: headers });

    }
    saveFacility(facilityData?, images?, offerdata?, selectedAmeninties?, gpsdata?, saveFacilityStatus?) {
        console.log(facilityData[1].dayStartTime2);
        let body = {
            "facilityType": facilityData[0].facilityType != '' ? facilityData[0].facilityType : "",
            "location": {
                "id": facilityData[0].location != '' ? facilityData[0].location : 0
            },
            "huddleVerified": facilityData[1].huddilVerify == true ? 1 : 0,
            "emailId": facilityData[1].spEmail != '' ? facilityData[1].spEmail : "",
            "alternateEmailId": facilityData[1].spAlternateEmail != '' ? facilityData[1].spAlternateEmail : "",
            "title": facilityData[0].meetingRoomName != '' ? facilityData[0].meetingRoomName : "",
            "description": facilityData[0].description != '' ? facilityData[0].description : "",
            "capacity": facilityData[0].numberOfSeats != '' ? facilityData[0].numberOfSeats : "",
            "latitude": gpsdata[0] != '' ? gpsdata[0] : "",
            "longtitude": gpsdata[1] != '' ? gpsdata[1] : "",
            "costPerHour": facilityData[1].costPerHour != '' ? facilityData[1].costPerHour : 0,
            "costPerDay": facilityData[1].costPerDay != '' ? facilityData[1].costPerDay : 0,
            "costPerMonth": facilityData[1].costPerMonth != '' ? facilityData[1].costPerMonth : 0,
            "size": facilityData[0].areaSize != '' ? facilityData[0].areaSize : "",
            "contactNo": facilityData[1].spContactNumber != '' ? facilityData[1].spContactNumber : "",
            "alternateContactNo": facilityData[1].spAlternateContactNumber != '' ? facilityData[1].spAlternateContactNumber : "",
            "paymnetType": facilityData[1].paymentMethod != '' ? facilityData[1].paymentMethod : 0,
            "facilityCancellationCharges": {
                "duration1": facilityData[1].noOfDaysBefore1 != '' ? facilityData[1].noOfDaysBefore1 : 0,
                "percentage1": facilityData[1].cancelationCharge1 != '' ? facilityData[1].cancelationCharge1 : 0,
                "duration2": facilityData[1].noOfDaysBefore2 != '' ? facilityData[1].noOfDaysBefore2 : 0,
                "percentage2": facilityData[1].cancelationCharge2 != '' ? facilityData[1].cancelationCharge2 : 0,
                "duration3": facilityData[1].noOfDaysBefore3 != '' ? facilityData[1].noOfDaysBefore3 : 0,
                "percentage3": facilityData[1].cancelationCharge3 != '' ? facilityData[1].cancelationCharge3 : 0
            },
            "facilityAmenities": selectedAmeninties != '' ? selectedAmeninties : null,
            "facilityPhotos": images != '' ? images : null,
            "facilityTimings": [
                {
                    "weekDay": 1,
                    "openingTime": facilityData[1].dayStartTime1 == undefined ? "00:00:00" : facilityData[1].dayStartTime1,
                    "closingTime": facilityData[1].dayEndTime1 == undefined ? "00:00:00" : facilityData[1].dayEndTime1
                },
                {
                    "weekDay": 2,
                    "openingTime": facilityData[1].dayStartTime2 == undefined ? "00:00:00" : facilityData[1].dayStartTime2,
                    "closingTime": facilityData[1].dayEndTime2 == undefined ? "00:00:00" : facilityData[1].dayEndTime2
                },
                {
                    "weekDay": 3,
                    "openingTime": facilityData[1].dayStartTime3 == undefined ? "00:00:00" : facilityData[1].dayStartTime3,
                    "closingTime": facilityData[1].dayEndTime3 == undefined ? "00:00:00" : facilityData[1].dayEndTime3
                },
                {
                    "weekDay": 4,
                    "openingTime": facilityData[1].dayStartTime4 == undefined ? "00:00:00" : facilityData[1].dayStartTime4,
                    "closingTime": facilityData[1].dayEndTime4 == undefined ? "00:00:00" : facilityData[1].dayEndTime4
                },
                {
                    "weekDay": 5,
                    "openingTime": facilityData[1].dayStartTime5 == undefined ? "00:00:00" : facilityData[1].dayStartTime5,
                    "closingTime": facilityData[1].dayEndTime5 == undefined ? "00:00:00" : facilityData[1].dayEndTime5
                },
                {
                    "weekDay": 6,
                    "openingTime": facilityData[1].dayStartTime6 == undefined ? "00:00:00" : facilityData[1].dayStartTime6,
                    "closingTime": facilityData[1].dayEndTime6 == undefined ? "00:00:00" : facilityData[1].dayEndTime6
                },
                {
                    "weekDay": 7,
                    "openingTime": facilityData[1].dayStartTime7 == undefined ? "00:00:00" : facilityData[1].dayStartTime7,
                    "closingTime": facilityData[1].dayEndTime7 == undefined ? "00:00:00" : facilityData[1].dayEndTime7
                }

            ],

            "facilityOfferses": offerdata != '' ? offerdata : null,
            "save": "true"

        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(body));
        return this.http.post(this.huddil_baseUrl + "facility/?sessionId=" + this.sessionId, JSON.stringify(body), { headers: headers });

    }
    updateSavedFacility(facilityData?, images?, offerdata?, selectedAmeninties?, gpsdata?, saveFacilityStatus?, id?) {
        console.log(facilityData[1].dayStartTime3);
        let body = {
            "facilityType": facilityData[0].facilityType != '' ? facilityData[0].facilityType : "",
            "id": id,
            "location": {
                "id": facilityData[0].location != '' ? facilityData[0].location : 0
            },
            "huddleVerified": facilityData[1].huddilVerify == true ? 1 : 0,
            "emailId": facilityData[1].spEmail != '' ? facilityData[1].spEmail : "",
            "alternateEmailId": facilityData[1].spAlternateEmail != '' ? facilityData[1].spAlternateEmail : "",
            "title": facilityData[0].meetingRoomName != '' ? facilityData[0].meetingRoomName : "",
            "description": facilityData[0].description != '' ? facilityData[0].description : "",
            "capacity": facilityData[0].numberOfSeats != '' ? facilityData[0].numberOfSeats : "",
            "latitude": gpsdata[0] != '' ? gpsdata[0] : "",
            "longtitude": gpsdata[1] != '' ? gpsdata[1] : "",
            "costPerHour": facilityData[1].costPerHour != '' ? facilityData[1].costPerHour : 0,
            "costPerDay": facilityData[1].costPerDay != '' ? facilityData[1].costPerDay : 0,
            "costPerMonth": facilityData[1].costPerMonth != '' ? facilityData[1].costPerMonth : 0,
            "size": facilityData[0].areaSize != '' ? facilityData[0].areaSize : "",
            "contactNo": facilityData[1].spContactNumber != '' ? facilityData[1].spContactNumber : "",
            "alternateContactNo": facilityData[1].spAlternateContactNumber != '' ? facilityData[1].spAlternateContactNumber : "",
            "paymnetType": facilityData[1].paymentMethod != '' ? facilityData[1].paymentMethod : 0,
            "facilityCancellationCharges": {
                "duration1": facilityData[1].noOfDaysBefore1 != '' ? facilityData[1].noOfDaysBefore1 : 0,
                "percentage1": facilityData[1].cancelationCharge1 != '' ? facilityData[1].cancelationCharge1 : 0,
                "duration2": facilityData[1].noOfDaysBefore2 != '' ? facilityData[1].noOfDaysBefore2 : 0,
                "percentage2": facilityData[1].cancelationCharge2 != '' ? facilityData[1].cancelationCharge2 : 0,
                "duration3": facilityData[1].noOfDaysBefore3 != '' ? facilityData[1].noOfDaysBefore3 : 0,
                "percentage3": facilityData[1].cancelationCharge3 != '' ? facilityData[1].cancelationCharge3 : 0
            },
            "facilityAmenities": selectedAmeninties != '' ? selectedAmeninties : null,
            "facilityPhotos": images != '' ? images : null,
            "facilityTimings": [
                {
                    "weekDay": 1,
                    "openingTime": facilityData[1].dayStartTime1 != undefined ? facilityData[1].dayStartTime1 : "00:00:00",
                    "closingTime": facilityData[1].dayEndTime1 != undefined ? facilityData[1].dayEndTime1 : "00:00:00"
                },
                {
                    "weekDay": 2,
                    "openingTime": facilityData[1].dayStartTime2 != undefined ? facilityData[1].dayStartTime2 : "00:00:00",
                    "closingTime": facilityData[1].dayEndTime2 != undefined ? facilityData[1].dayEndTime2 : "00:00:00"
                },
                {
                    "weekDay": 3,
                    "openingTime": facilityData[1].dayStartTime3 != undefined ? facilityData[1].dayStartTime3 : "00:00:00",
                    "closingTime": facilityData[1].dayEndTime3 != undefined ? facilityData[1].dayEndTime3 : "00:00:00"
                },
                {
                    "weekDay": 4,
                    "openingTime": facilityData[1].dayStartTime4 != undefined ? facilityData[1].dayStartTime4 : "00:00:00",
                    "closingTime": facilityData[1].dayEndTime4 != undefined ? facilityData[1].dayEndTime4 : "00:00:00"
                },
                {
                    "weekDay": 5,
                    "openingTime": facilityData[1].dayStartTime5 != undefined ? facilityData[1].dayStartTime5 : "00:00:00",
                    "closingTime": facilityData[1].dayEndTime5 != undefined ? facilityData[1].dayEndTime5 : "00:00:00"
                },
                {
                    "weekDay": 6,
                    "openingTime": facilityData[1].dayStartTime6 != undefined ? facilityData[1].dayStartTime6 : "00:00:00",
                    "closingTime": facilityData[1].dayEndTime6 != undefined ? facilityData[1].dayEndTime6 : "00:00:00"
                },
                {
                    "weekDay": 7,
                    "openingTime": facilityData[1].dayStartTime7 != undefined ? facilityData[1].dayStartTime7 : "00:00:00",
                    "closingTime": facilityData[1].dayEndTime7 != undefined ? facilityData[1].dayEndTime7 : "00:00:00"
                }

            ],

            "facilityOfferses": offerdata != '' ? offerdata : null,
            "save": "true"

        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(body));
        return this.http.put(this.huddil_baseUrl + "facility/?sessionId=" + this.sessionId, JSON.stringify(body), { headers: headers });

    }
    deleteSavedFacility(id) {
        return this.http.delete(this.huddil_baseUrl + 'facility/?sessionId=' + this.sessionId + '&facilityId=' + id);
    }
    editFacility(facilityId, facilityData, images, offerdata, selectedAmeninties) {
        let body = {
            "facilityType": facilityData[0].facilityType,
            "id": facilityId,
            "location": {
                "id": facilityData[0].location
            },
            "huddleVerified": facilityData[1].huddilVerify,
            "emailId": facilityData[1].spEmail,
            "title": facilityData[0].meetingRoomName,
            "description": facilityData[0].description,
            "capacity": facilityData[0].numberOfSeats,
            "latitude": 0,
            "longtitude": 0,
            "costPerHour": facilityData[1].costPerHour,
            "costPerDay": facilityData[1].costPerDay,
            "costPerMonth": facilityData[1].costPerMonth,
            "size": facilityData[0].areaSize,
            "contactNo": facilityData[1].spContactNumber,
            "alternateEmailId": facilityData[1].spAlternateEmail,
            "alternateContactNo": facilityData[1].spAlternateContactNumber,
            "paymnetType": facilityData[1].paymentMethod,
            "facilityCancellationCharges": {
                "duration1": facilityData[1].noOfDaysBefore1,
                "percentage1": facilityData[1].cancelationCharge1,
                "duration2": facilityData[1].noOfDaysBefore2 != '' ? facilityData[1].noOfDaysBefore2 : 0,
                "percentage2": facilityData[1].cancelationCharge2 != '' ? facilityData[1].cancelationCharge2 : 0,
                "duration3": facilityData[1].noOfDaysBefore3 != '' ? facilityData[1].noOfDaysBefore3 : 0,
                "percentage3": facilityData[1].cancelationCharge3 != '' ? facilityData[1].cancelationCharge3 : 0
            },
            "facilityAmenities": selectedAmeninties,
            "facilityPhotos": images,
            "facilityTimings": [
                {
                    "weekDay": 1,
                    "openingTime": facilityData[1].dayStartTime1,
                    "closingTime": facilityData[1].dayEndTime1
                },
                {
                    "weekDay": 2,
                    "openingTime": facilityData[1].dayStartTime2,
                    "closingTime": facilityData[1].dayEndTime2
                },
                {
                    "weekDay": 3,
                    "openingTime": facilityData[1].dayStartTime3,
                    "closingTime": facilityData[1].dayEndTime3
                },
                {
                    "weekDay": 4,
                    "openingTime": facilityData[1].dayStartTime4,
                    "closingTime": facilityData[1].dayEndTime4
                },
                {
                    "weekDay": 5,
                    "openingTime": facilityData[1].dayStartTime5,
                    "closingTime": facilityData[1].dayEndTime5
                },
                {
                    "weekDay": 6,
                    "openingTime": facilityData[1].dayStartTime6,
                    "closingTime": facilityData[1].dayEndTime6
                },
                {
                    "weekDay": 7,
                    "openingTime": facilityData[1].dayStartTime7,
                    "closingTime": facilityData[1].dayEndTime7
                }

            ],
            "facilityOfferses": offerdata
        }

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(this.huddil_baseUrl + "facility/?sessionId=" + this.sessionId, JSON.stringify(body), { headers: headers });

    }

    updateFacilityStatusBySP(comments, id, status, confirm) {
        return this.http.put(this.huddil_baseUrl + "updateStatusBySP/" + this.sessionId + "/" + comments + "/" + id + "/" + status + "/" + confirm, '');

    }
    getBookingsCountbySP() {
        return this.http.get(this.huddil_baseUrl + "spBookingStatusCnt/?sessionId=" + this.sessionId);
    }
    downloadFacilitiesPhotos(fileName) {
        let body = {
            "fileName": fileName
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.huddil_baseUrl + "downloadFile/", JSON.stringify(body), { responseType: ResponseContentType.Blob, headers: headers }).map((res: Response) => res.blob());

    }
    updateBookingStatusBySP(bookingId, status, confirm) {
        return this.http.put(this.huddil_baseUrl + "updateBookingStatusBySp/?sessionId=" + this.sessionId + "&bookingId=" + bookingId + "&status=" + status + "&confirm=" + confirm, '');

    }
    getServiceProviderBasedUpnoMailId(emailid) {
        return this.http.get(this.huddil_baseUrl + 'searchUser/?sessionId=' + this.sessionId + '&user=' + emailid + '&userType=service provider')
            .map(res => res.json());
    }

    blockServiceProviderDetails(id, comments) {
        return this.http.put(this.huddil_baseUrl + 'deActivateUser/?sessionId=' + this.sessionId + '&id=' + id + '&status=true&comments=' + comments + '', '');
    }
    bookingCancellationDetailsBySP(cityId, localityId, month, bookingStatus, facilityTypeId, pageNo, count) {
        return this.http.get(this.huddil_baseUrl + "bookingCancellationDetailsBySP/?sessionId=" + this.sessionId + "&cityId=" + cityId + "&localityId=" + localityId + "&month=" + month + "&status=" + bookingStatus + "&typeId=" + facilityTypeId + "&pageNo=" + pageNo + "&count=" + count);

    }


    //Advisor APIs
    getFacilitiesByFiltersForAdvisor(cityId, locality, location, typeId, status, searchTitle, pageNo, count) {
        return this.http.get(this.huddil_baseUrl + 'filterFacility?sessionId=' + this.sessionId + '&cityId=' + cityId + '&localityId=' + locality + '&locationId=' + location + '&typeId=' + typeId + '&status=' + status + '&search=' + searchTitle + "&pageNo=" + pageNo + "&count=" + count);
    }
    getfacilityByIdForAdvisor(facilityId) {
        return this.http.get(this.huddil_baseUrl + "facility/?sessionId=" + this.sessionId + "&id=" + facilityId)

    }
    getFacilityDataForAdvisor() {
        return this.http.get(this.huddil_baseUrl + 'facility/' + this.sessionId).map(res => res.json());
    }
    getFacilityStatusByAdvisor() {
        return this.http.get(this.huddil_baseUrl + "facilityStatusByAdvsr/" + this.sessionId);
    }

    getFacilitiesForAdvisorData(pageno, count) {

        return this.http.get(this.huddil_baseUrl + "facilitiesForAdvisor/?sessionId=" + this.sessionId + '&pageNo=' + pageno + '&count=' + count);

    }

    updateFacilityStatusByAdvisor(Id, status, comments) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put(this.huddil_baseUrl + "updateFacilityStatusByAdvisor?sessionId=" + this.sessionId + '&id=' + Id + '&status=' + status + '&comments=' + comments, '');
    }

    getAdvisorBookings(city, locality, month, status, typeId, pageno, count) {

        return this.http.get(this.huddil_baseUrl + 'bookings?sessionId=' + this.sessionId + '&cityId=' + city + '&localityId=' + locality + '&month=' + month + '&status=' + status + '&typeId=' + typeId + '&pageNo=' + pageno + '&count=' + count);
    }

    getServiceProviderDetailsForAdvisor(seachValue) {
        return this.http.get(this.huddil_baseUrl + '/searchUser/?sessionId=' + this.sessionId + '&user=' + seachValue + '&userType=service provider')

    }

    getserviceProviderDetails() {
        return this.http.get(this.huddil_baseUrl + 'searchUser/?sessionId=' + this.sessionId + '&user=sp&userType=service provider')

    }
    getBookingDetailsForAdvisor(seachValue, pageNo, count) {
        return this.http.get(this.huddil_baseUrl + 'bookings/?sessionId=' + this.sessionId + '&emailId=' + seachValue + '&pageNo=' + pageNo + '&count=' + count);
    }
    unblockServiceProviderDetails(id) {
        return this.http.put(this.huddil_baseUrl + 'deActivateUser/?sessionId=' + this.sessionId + '&id=' + id + '&status=false&comments=activate', '');
    }

    //consumer api's /////////////////////////////
    getEnquiryDetails(facilityId, txtTellUs, toDateTime, fromDateTime, basePrice, sgstValue, cgstValue, offerData, totalPrice, emailId, mobileNumber, name) {
        let body = {
            "body": txtTellUs,
            "toDateTime": toDateTime,
            "fromDateTime": fromDateTime,
            "basePrice": basePrice,
            "sgst": sgstValue,
            "cgst": cgstValue,
            "offer": offerData,
            "totalPrice": totalPrice,
            "emailId": emailId,
            "mobileNo": mobileNumber,
            "name": name
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        console.log(JSON.stringify(body));
        return this.http.post(this.huddil_baseUrl + "sendEnquiry/?facilityId=" + facilityId, JSON.stringify(body), { headers: headers });

    }
    getFilterDataForConsumer(startTime, endTime, minCost, maxCost, maxCapacity, facilityType, cityId, localityId, offers, amenity, pageno, count) {

        return this.http.get(this.huddil_baseUrl + 'filterFacilityByConsumer/?sessionId=null&fromTime=' + startTime + '&toTime=' + endTime + '&minCost=' + minCost + '&maxCost=' + maxCost + '&maxCapacity=' + maxCapacity + '&facilityType=' + facilityType + '&cityId=' + cityId +
            '&localityId=' + localityId + '&offers=' + offers + '&amenity=' + amenity + '&pageNo=' + pageno + '&count=' + count);
    }
    getFavouriteFacilityData(pageno, count) {
        return this.http.get(this.huddil_baseUrl + 'favorities/?sessionId=' + this.sessionId + '&pageNo=' + pageno + '&count=' + count);
    }
    removeItemfromFavoriteList(id) {
        return this.http.delete(this.huddil_baseUrl + 'favorities/' + this.sessionId + '/' + id);
    }
    getConsumerFacilityDetails(facilityId) {

        if (this.sessionId != null && this.sessionId != '') {
            console.log(this.huddil_baseUrl + "facility/?sessionId=" + this.sessionId + "&id=" + facilityId);
            return this.http.get(this.huddil_baseUrl + "facility/?sessionId=" + this.sessionId + "&id=" + facilityId)
                .map(res => res.json());
        }
        else {
            console.log(this.huddil_baseUrl + "facility/?id=" + facilityId);
            return this.http.get(this.huddil_baseUrl + "facility/?id=" + facilityId)
                .map(res => res.json());
        }
    }
    getCalculateCost(fromTime, toTime, capacity, facilityId) {
        return this.http.get(this.huddil_baseUrl + 'calculateCost/?fromTime=' + fromTime + '&toTime=' + toTime + '&capacity=' + capacity + '&facilityId=' + facilityId)
            .map(res => res.json());
    }
    getNearbyLocations(lat, log, facilityType, id) {
        return this.http.get(this.huddil_baseUrl + "nearBy/?lat=" + lat + "&longt=" + log + "&type=" + facilityType + '&facilityId=' + id).map(res => res.json());
    }
    addItemIntoFavoriteList(facilityId) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.huddil_baseUrl + 'favorities/' + this.sessionId + '?id=' + facilityId, '', { headers: headers });
    }
    createBooking(fromTime, toTime, capacity, facilityId, paymentMethod, redirectUrl) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.huddil_baseUrl + 'bookNow/?fromTime=' + fromTime + '&toTime=' + toTime + '&capacity=' + capacity + '&facilityId=' + facilityId + '&sessionId=' + this.sessionId + '&paymentMethod=' + paymentMethod + '&redirectUrl=' + redirectUrl, '', { headers: headers }).map(res => res.json());
    }
    getUpcomingBookings(pageno, count) {

        return this.http.get(this.huddil_baseUrl + "bookingDetailsByConsumer/?sessionId=" + this.sessionId + '&pageNo=' + pageno + '&count=' + count)
            ;
    }

    getBookingHistoryDetails(pageno, count) {

        return this.http.get(this.huddil_baseUrl + "bookingHistoryDetailsByConsumer/?sessionId=" + this.sessionId + '&pageNo=' + pageno + '&count=' + count)
            ;
    }
    getBookingCancellationDetails(pageno, count) {
        //console.log(this.huddil_baseUrl + "bookingCancellationDetailsByConsumer/?sessionId=consumer4");
        return this.http.get(this.huddil_baseUrl + "bookingCancellationDetailsByConsumer/?sessionId=" + this.sessionId + '&pageNo=' + pageno + '&count=' + count)
            ;
    }
    getReviewsOfFacility(facilityId) {

        return this.http.get(this.huddil_baseUrl + "reviewsForFacility/?facilityId=" + facilityId).map(res => res.json());
    }
    calculateCancelCost(id) {
        return this.http.get(this.huddil_baseUrl + "calculateCancellationCost/?bookingId=" + id + "&sessionId=" + this.sessionId + "&reason=cancel")
            .map(res => res.json());

    }

    cancelBookingDetails(id) {
        return this.http.get(this.huddil_baseUrl + "confirmCancel/?bookingId=" + id + "&sessionId=" + this.sessionId + "&reason=cancel")
            .map(res => res.json());
    }

    addReviewsToFacility(review, facilityId, rating) {
        let body =
            {
                "comments": review,
                "id": facilityId,
                "rating": rating,
                "parentId": 0
            }


        let headers = new Headers();
        headers.append('Content-Type', 'application/json');


        return this.http.post(this.huddil_baseUrl + 'reviews/' + this.sessionId,
            JSON.stringify(body), { headers: headers });

    }
    getExistingReview(id) {

        return this.http.get(this.huddil_baseUrl + 'reviews/?sessionId=' + this.sessionId + '&bookingId=' + id).map(res => res.json());
    }

    //attendees api in consumer
    getTeamDetails() {
        return this.http.get(this.huddil_baseUrl + 'team/?sessionId=' + this.sessionId).map(res => res.json())
    }

    getParticipantsData(id) {

        return this.http.get(this.huddil_baseUrl + 'participants/?sessionId=' + this.sessionId + '&id=' + id).map(res => res.json())
    }
    addTeamAndParticipants(teamName, attendeesData) {
        let body = attendeesData;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');


        return this.http.post(this.huddil_baseUrl + 'teamAndParticipant/?sessionId=' + this.sessionId + '&teamName=' + teamName,
            JSON.stringify(body), { headers: headers });
    }
    updateTeamAndParticipants(teamId, teamName, attendeesData) {
        let body = attendeesData;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');


        return this.http.post(this.huddil_baseUrl + 'teamAndParticipantDelAndCre/?sessionId=' + this.sessionId + '&teamName=' + teamName + '&teamId=' + teamId,
            JSON.stringify(body), { headers: headers });
    }
    removeMeetingAsWellAsParticipants(id) {
        return this.http.delete(this.huddil_baseUrl + '/team/?sessionId=' + this.sessionId + '&id=' + id);
    }
    removeParticipant(id) {
        return this.http.delete(this.huddil_baseUrl + '/participant/?sessionId=' + this.sessionId + '&id=' + id);
    }
    createMeeting(bookingId, title, description, teamId) {
        let body = {

            "booking": {
                "id": bookingId
            },
            "title": title,
            "description": description,
            "teamId": teamId
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.huddil_baseUrl + 'meeting/?sessionId=' + this.sessionId,
            JSON.stringify(body), { headers: headers });
    }
    confirmBooking(fromTime, toTime, capacity, facilityId, paymentId, bookingId) {
        return this.http.put(this.huddil_baseUrl + "confirmBooking/?fromTime=" + fromTime + "&toTime=" + toTime + "&capacity=" + capacity + "&facilityId=" + facilityId + "&sessionId=" + this.sessionId + "&paymentId=" + paymentId + "&bookingId=" + bookingId, '').map(res => res.json());

    }




    resetPassword(newPassword, confirmPassword, emailId, token) {
        let body = {
            "newPassword": newPassword,
            "confirmPassword": confirmPassword
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "resetPassword/" + emailId + "/" + token + '/', JSON.stringify(body), { headers: headers });

    }
    sendForgotPasswordOTPtoEmail(emailId) {
        return this.http.get(this.wrapper_baseUrl + "sendPasswordResetEmailWithoutLogin/?emailId=" + emailId + '&productName=huddil&redirectUrl=' + this.baseUrl + 'reset-password')


    }
    verifyByMobileOTP(mobileOTP, mobileNumber, userType, redirectUrl) {

        return this.http.get(this.wrapper_baseUrl + "verifyMobileNumberWithOTP/?OTP=" + mobileOTP + "&mobileNo=" + mobileNumber + "&productName=huddil&userType=" + userType + "&redirectUrl=" + redirectUrl)

    }
    checkEmailIdAvailability(valueParam: String) {

        return this.http.get(this.wrapper_baseUrl + 'emailExist/?emailId=' + valueParam)
    }
    checkMobileNumberAvailability(valueParam: String) {

        return this.http.get(this.wrapper_baseUrl + 'mobNoExist/?mobileNo=%2B91' + valueParam)
    }
    updateDetails(addressingName, userType, email) {
        let body = {

            "addressingName": addressingName,
            "emailId": email,
            "product": "huddil",
            "userType": userType
        }


        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this.wrapper_baseUrl + "usrDts/" + this.sessionId, JSON.stringify(body), { headers: headers });
    }
    sendOTPToMobileNumberForEditProfile(mobile) {

        return this.http.get(this.wrapper_baseUrl + 'sendPasswordResetOTPWithoutLogin?mobileNo=' + mobile + '&product=huddil&sessionId=' + this.sessionId)
    }

    updateMobileNumber(newMobileNumber, otp) {

        return this.http.put(this.wrapper_baseUrl + 'updateMobileNumber/?sessionId=' + this.sessionId + '&newMobileNumber=' + newMobileNumber + '&otp=' + otp, '')
    }


    //social login api's

    consumerSignupWithGoogle(name, email, mobile, accessToken, redirectUrl) {

        let body = {
            "emailId": email,
            "mobileNo": mobile,
            "addressingName": name,
            "product": "huddil",
            "userType": "consumer",
            "termsConditionsHistories": [
                {
                    "termsConditions": {
                        "id": this.consumerTermsId
                    }
                }
            ]
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "googleUser/?accessToken=" + accessToken + "&redirectUrl=" + redirectUrl, JSON.stringify(body), { headers: headers });
    }
    consumerSignupWithFacebook(name, email, mobile, accessToken, redirectUrl) {

        let body = {
            "emailId": email,
            "mobileNo": mobile,
            "addressingName": name,
            "product": "huddil",
            "userType": "consumer",
            "termsConditionsHistories": [
                {
                    "termsConditions": {
                        "id": this.consumerTermsId
                    }
                }
            ]
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "facebookUser/?accessToken=" + accessToken + "&redirectUrl=" + redirectUrl, JSON.stringify(body), { headers: headers });
    }
    SPSignupWithGoogle(name, email, mobile, website, address, state, city, pincode, country, accessToken, redirectUrl) {

        let body = {
            "addressingName": name,
            "emailId": email,
            "mobileNo": mobile,
            "website": website,
            "address": address,
            "state": state,
            "city": city,
            "pincode": pincode,
            "country": country,
            "termsConditionsHistories": [
                {
                    "termsConditions": {
                        "id": this.SPTermsId
                    }
                }
            ],
            "product": "huddil",
            "userType": "service provider",
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "googleUser/?accessToken=" + accessToken + "&redirectUrl=" + redirectUrl, JSON.stringify(body), { headers: headers });
    }
    consumerSignInWithGoogle(emailId, accessToken, product) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "gAuth/?emailId=" + emailId + "&accessToken=" + accessToken + "&product=" + product, '', { headers: headers });
    }
    consumerSignInWithFacebook(emailId, accessToken, product) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "fAuth/?emailId=" + emailId + "&accessToken=" + accessToken + "&product=" + product, '', { headers: headers });
    }
    closeLoginPopup() {
        this.isLoginPopUp = false;
    }
}
