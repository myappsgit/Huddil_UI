import { Component } from '@angular/core';
import { MeetupService } from '../../provider/meetup.service';
import { Observable } from 'rxjs/Observable';

import { Router } from '@angular/router';

@Component({
    selector: 'favourite-facilities',
    templateUrl: './favourite-facilities.component.html',
    styleUrls: ['./favourite-facilities.component.css']
})
export class FavoriteFacilitiesComponent {

    favoriteFacilityData: any;
    emptyFavoriteData: boolean;
    //pagination
    totalPages;
    currentPage: number = 1;
    noOfRecordsInOnePage: number = 8;
    totalPaginationTabs: number = 0;

    errorMsz: string = '';
    isSessionExpired: boolean;

    constructor(public meetupService: MeetupService, public router: Router) {

    }
    ngOnInit() {
        this.getFavourites(1);
    }
    getFavourites(page) {
        // if (page == 1) {
        //     this.totalPaginationTabs = 0;
        // }
        this.currentPage = page;
        this.meetupService.getFavouriteFacilityData(page, this.noOfRecordsInOnePage).subscribe(response => {

            let responseCode = response.headers.get('ResponseCode');
            switch (responseCode) {
                case '2191':
                    this.favoriteFacilityData = JSON.parse(response.text());

                    if (this.favoriteFacilityData.length == 0) {
                        this.emptyFavoriteData = true;
                    }
                    else {
                        if (page == 1) {
                            this.totalPages = response.headers.get('totalRecords');
                            this.totalPaginationTabs = Math.ceil(this.totalPages / this.noOfRecordsInOnePage);
                        }
                    }
                    break;
                case '2192':
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
                    this.errorMsz = 'Internal server error';


                } else {
                    this.errorMsz = 'Something went wrong in server.';

                }
            })
    }
    facilityByPagination(page) {
        this.getFavourites(page);
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
}
