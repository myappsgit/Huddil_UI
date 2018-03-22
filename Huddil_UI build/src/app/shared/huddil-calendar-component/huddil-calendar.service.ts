import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { MeetupService } from '../../provider/meetup.service';

import 'rxjs/add/operator/map';

@Injectable()
export class HuddilCalendarService {

    wrapper_baseUrl: String;
    huddil_baseUrl: string;

    constructor(public http: Http, public meetupService: MeetupService) {

        //global cloud
        this.wrapper_baseUrl = this.meetupService.wrapper_baseUrl;
        this.huddil_baseUrl = this.meetupService.huddil_baseUrl;

    }

    getCalendarBookings(facilityId, fromTime) {
        return this.http.get(this.huddil_baseUrl + "calendarbookings/" + "?fromTime=" + fromTime + "&facilityId=" + facilityId);
    }
}