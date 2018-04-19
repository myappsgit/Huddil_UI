import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/timeout";
import { PlatformLocation } from '@angular/common';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { MeetupService } from '../../provider/meetup.service';

@Injectable()
export class AdminService {

    baseUrl: any;
    originurl: any;
    productName = 'huddil';
    wrapper_baseUrl: String;
    huddil_baseUrl: string;
    listOfCities: any = [];

    listOfAmenities: any = [];

    isLoading: boolean;
    isLoggedIn: boolean;
    public isShowPopup: boolean = false;
    public isWarningPopup: boolean;
    public isErrorPopup: boolean;
    public isSuccessPopup: boolean;
    public popupMessage: string = '';
    public isInvalisSessionPopup: boolean;

    public isInvalidSessionPopupDisplayed: boolean;

    public adminSessionId;

    constructor(private http: Http, public platformLocation: PlatformLocation, public domSanitizer: DomSanitizer,
        public meetupService: MeetupService) {

        this.wrapper_baseUrl = this.meetupService.wrapper_baseUrl;
        this.huddil_baseUrl = this.meetupService.huddil_baseUrl;

        this.baseUrl = this.meetupService.baseUrl;
        this.originurl = (platformLocation as any).location.origin;
    }

    // DASHBOARD PAGE START //
    logout() {

        return this.http.put(this.wrapper_baseUrl + "logout/?sessionId=" + this.adminSessionId + "&product=huddil", '');
    }
    forceLogoutWithoutSessionId() {
        sessionStorage.clear();
        localStorage.clear();
        this.isLoggedIn = false;
        this.meetupService.isLoggedIn = false;

    }
    getPaymentStatus(selectedYear, selectedMonth) {

        let sub = this.http.get(this.huddil_baseUrl + "statsPayment/?sessionId=" + this.adminSessionId + "&month=" + selectedMonth + "&year=" + selectedYear);
        // let timer=setTimeout(() => {
        //     sub.timeout(100);
        //     this.isLoading = false;
        //     alert("Slow network or no network.");
        // }, 5000);
        return sub;
    }

    getUserStatus() {
        return this.http.get(this.huddil_baseUrl + "statsUser/?sessionId=" + this.adminSessionId);
    }

    getFacilityStatus() {
        return this.http.get(this.huddil_baseUrl + "statsFacility/?sessionId=" + this.adminSessionId);
    }

    // DASHBOARD PAGE END //



    // PAYMENTS PAGE START //

    getListOfCities() {
        return this.http.get(this.huddil_baseUrl + 'city/');
    }

    //We are passing spId=0. Because we want to fetch all the details for all the sp's matching the search text.
    getPaymentStatusBySearch(selectedYear, selectedMonth, selectedCity, searchText, spId) {
        return this.http.get(this.huddil_baseUrl + "adminStatsPayments/?sessionId=" + this.adminSessionId + "&month=" + selectedMonth + "&year=" + selectedYear
            + "&city=" + selectedCity + "&spName=" + searchText + "&spId=" + spId);
    }

    // PAYMENTS PAGE END //



    // USERS PAGE START //


    //userFacility search
    searchUser(user, userType) {
        return this.http.get(this.huddil_baseUrl + "searchUser/?sessionId=" + this.adminSessionId + "&user=" + user + "&userType=" + userType);
        //    .map(response => response.json());
    }

    getSPCommissionByAdmin(spIdsString, month, year) {
        //https://52.15.86.32:8080/huddil-1.1.0/getSPCommissionByAdmin?ids=9%2C10%2C79%2C205%2C10869%2C10887%2C10889%2C10906%2C10942%2C10949&month=2&year=2018
        return this.http.get(this.huddil_baseUrl + "getSPCommissionByAdmin?ids=" + spIdsString + "&month=" + month + "&year=" + year);
    }

    updateSpCommission(spId, month, year, commission) {

        //console.log("From admin service updateSpCommission():id" + spId + "  month:" + month + "  year:" + year);

        let body = {

        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        //https://52.15.86.32:8443/huddil-1.1.0/updateSpCommission?sessionId=Y2IzMTI3N2EtNDEyNi00ZTNkLTkzZDEtZDE0ODA1YzBmNjcxMQ%3D%3D&spUserId=9&month=3&year=2018&commission=50
        //http://52.15.86.32:8080/huddil-1.1.0/updateSpCommission?sessionId=Y2IzMTI3N2EtNDEyNi00ZTNkLTkzZDEtZDE0ODA1YzBmNjcxMQ==&spUserId=9&month=3&year=2018
        return this.http.post(this.huddil_baseUrl + "updateSpCommission?sessionId=" + this.adminSessionId + "&spUserId=" + spId + "&month=" + month + "&year=" + year + "&commission=" + commission, JSON.stringify(body), { headers: headers });
    }

    //addnew Advisor
    addNewAdvisor(name, email, mobile, password, redirectUrl) {
        let body = {
            "emailId": email,
            "mobileNo": mobile,
            "authorization": {
                "password": btoa(password)
            },
            "termsConditionsHistories": [
                {
                    "termsConditions": {
                        "id": 0
                    }
                }
            ],
            "addressingName": name,
            "product": "huddil",
            "userType": "advisor"
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this.wrapper_baseUrl + "usrDts/?redirectUrl=" + redirectUrl, JSON.stringify(body), { headers: headers });
    }

    checkEmailIdAvailability(value: string) {

        return this.http.get(this.wrapper_baseUrl + 'emailExist/?emailId=' + value);
    }

    checkMobileNumberAvailability(value: string) {

        return this.http.get(this.wrapper_baseUrl + 'mobNoExist/?mobileNo=%2B91' + value);
    }

    //forActivateAndDeactivate User
    deActivateUser(userId, blockUser: boolean, message) {
        return this.http.put(this.huddil_baseUrl + "deActivateUser/?sessionId=" + this.adminSessionId + "&id=" + userId + "&status=" + blockUser + "&comments=" + message, '');
    }

    //USERS PAGE END//

    //FACILITIES PAGE START//
    getFacilityList() {
        return this.http.get(this.huddil_baseUrl + 'facilityType/')
            .map(response => response.json());
    }

    //Seachfacilities
    searchFacilityByAdmin(searchText, searchFor, facilityType, pageNo, count) {
        return this.http.get(this.huddil_baseUrl + "searchFacilityByAdmin/?sessionId=" + this.adminSessionId + "&search=" + searchText + "&searchType=" + searchFor + "&facilityType=" + facilityType + "&pageNo=" + pageNo + "&count=" + count)
        //  .map(response => response.json());
    }

    getFacilityDetails(id) {
        return this.http.get(this.huddil_baseUrl + "facility/?id=" + id + "&sessionId=" + this.adminSessionId)
        //   .map(res => res.json());
    }
    //get Reviews
    getReviews(facilityId) {
        return this.http.get(this.huddil_baseUrl + "reviewsForFacility/?facilityId=" + facilityId);
    }

    updateFacilityStatusByAdvisor(facilityId, blockFacility, message) {
        return this.http.put(this.huddil_baseUrl + "updateFacilityStatusByAdvisor/?sessionId=" + this.adminSessionId + "&id=" + facilityId + "&status=" + blockFacility + "&comments=" + message, '');
    }

    //FACILITY DETAILS PAGE END//


    //TERMS PAGE START//

    getListOfTermsAndConditions() {
        return this.http.get(this.wrapper_baseUrl + "termsAndConditions/?sessionId=" + this.adminSessionId + "&product=huddil");
    }

    addTermsAndConditions(file, date, userType) {
        let headers = new Headers();
        let formData: FormData = new FormData();
        formData.append("fileName", file, file.name);

        // https://ec2-18-216-216-162.us-east-2.compute.amazonaws.com:8443/wrapper-1.0.5-BUILD-SNAPSHOT/termsAndConditions/?sessionId=NDYwMTE0YzctODU3ZC00NjEyLTkwYjktOTFmZTM5ODMwMTRmMQ%3D%3D&userType=8&productId=2&startDate=2018-01-19&title=Test3

        return this.http.post(this.wrapper_baseUrl + "termsAndConditions/?sessionId=" + this.adminSessionId + "&userType=" + userType + "&productId=2&startDate=" + date + "&title", formData, { headers: headers });
    }

    //TERMS PAGE END//

    //AMENITIES PAGE START//

    getAmenities() {
        //console.log(this.huddil_baseUrl + "amenity/");
        return this.http.get(this.huddil_baseUrl + "amenity/")
    }
    // getAmenities() {
    //     //console.log(this.huddil_baseUrl + "amenity/");
    //     return this.http.get(this.huddil_baseUrl + "amenity/").map(res => res.json()).subscribe(response => {
    //         response.forEach(element => {
    //             let imageIcon = this.domSanitizer.bypassSecurityTrustHtml(element.icon);
    //             let id = element.id;
    //             let name = element.name;
    //             this.listOfAmenities.push({ "icon": imageIcon, "id": id, "name": name });
    //         });
    //     });
    //}

    addAmenity(svgData, name) {
        let body = {
            "icon": svgData,
            "name": name,
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.huddil_baseUrl + "amenity/" + this.adminSessionId, JSON.stringify(body), { headers: headers });
    }

    //AMENITIES PAGE END//


    //LOCATIONS PAGE START//
    //Add City
    addCity(cityName) {
        let body = {
            "name": cityName,
            "tax": {
                "state": "",
                "sgst": 0,
                "cgst": 0,
                "igst": 0
            }
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(JSON.stringify(body));
        //console.log(this.huddil_baseUrl + "city/" + this.adminSessionId);
        return this.http.post(this.huddil_baseUrl + "city/" + this.adminSessionId, JSON.stringify(body), { headers: headers });
    }
    // City End 

    // Locality 
    addLocality(localityName, cityId) {
        let body = {
            "name": localityName,
            "city": {
                "id": cityId
            },
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(JSON.stringify(body));
        //console.log(this.huddil_baseUrl + "locality/" + this.adminSessionId);
        return this.http.post(this.huddil_baseUrl + "locality/" + this.adminSessionId, JSON.stringify(body), { headers: headers });
    }

    getLocalities(id) {
        return this.http.get(this.huddil_baseUrl + 'localities/' + id);//.map(res => res.json());
    }

    getLocality() {
        console.log(this.huddil_baseUrl + "locality/");
        return this.http.get(this.huddil_baseUrl + "locality/")
    }
    //Locality End  

    //LOCATIONS PAGE END//
}