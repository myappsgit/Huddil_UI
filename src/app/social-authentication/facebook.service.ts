import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Router } from '@angular/router';
import { MeetupService } from '../provider/meetup.service';

import { Http, Headers, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

declare const FB: any;

@Injectable()
export class FacebookService {
    private appId: string

    public response = new BehaviorSubject<boolean>(false);
    public loginResponse = new BehaviorSubject<boolean>(false);
    public data = this.response.asObservable();
    public fbApiUrl = 'https://graph.facebook.com/v2.5/';

    //facebookUserData: any = [];

    constructor(public meetupService: MeetupService, public router: Router, public http: Http) {
        this.init();
    }

    login() {
        FB.init({
            appId: this.meetupService.facebookAppKey,
            xfbml: true,
            version: 'v2.5'
        })
        FB.login(loginResponse => {
            this.meetupService.facebooktoken = loginResponse.authResponse.accessToken;

        })
    }

    init() {
        let js,
            id = 'facebook-jssdk',
            ref = document.getElementsByTagName('script')[0];

        if (document.getElementById(id)) {
            return;
        }

        js = document.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/sdk.js";

        ref.parentNode.insertBefore(js, ref);

        js.onload = results => {
            this.initSDK()
        }
    }

    initSDK() {
        FB.init({
            appId: this.meetupService.facebookAppKey,
            xfbml: true,
            version: 'v2.5'
        })

        this.setCallback()
    }

    setCallback() {
        FB.getLoginStatus(response => {
            if (response.status == 'connected') {
                this.meetupService.isUserLoggedInWithFacebook = true;
            }
            else {
                this.meetupService.isUserLoggedInWithFacebook = false;

            }

        });
    }
    logout() {
        FB.init({
            appId: this.meetupService.facebookAppKey,
            xfbml: true,
            version: 'v2.5'
        })
        FB.logout(function (response) {

            alert('logout successfully');
            window.location.reload();

        });
    }
    fetchInformation(accessToken) {
        return this.http.get(this.fbApiUrl + 'me/?fields=email,name,id&access_token=' + accessToken).map(res => res.json());

    }
}