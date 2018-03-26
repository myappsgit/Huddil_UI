import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Router } from '@angular/router';
import { MeetupService } from '../provider/meetup.service';

declare const FB: any;

export class Facebook {
    private appId: string

    public response = new BehaviorSubject<boolean>(false);
    public loginResponse = new BehaviorSubject<boolean>(false);
    public data = this.response.asObservable();

    constructor(public meetupService: MeetupService, public router: Router) {
        //this.init();
    }

    login() {
        FB.init({
            appId: this.meetupService.facebookAppKey,
            xfbml: true,
            version: 'v2.5'
        })
        FB.login(loginResponse => {
            if (loginResponse.status === 'connected') {
                alert('successfully login');
                this.meetupService.isUserLoggedInWithFacebook = true;
                this.fetchInformation();
            } else {
                alert('some error occured');
            }
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
            this.router.navigate(['']);
        });
    }
    fetchInformation() {
        FB.api('/me', function (response) {

        });
    }
}