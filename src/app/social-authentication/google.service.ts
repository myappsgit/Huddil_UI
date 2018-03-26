import { Injectable, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Router } from '@angular/router';
import { MeetupService } from '../provider/meetup.service';


declare const gapi: any;

@Injectable()
export class GoogleService {

    public auth2: any;
    constructor(public meetupService: MeetupService) {

    }
    public login() {
        let response;
        gapi.load('auth2', () => {
            var auth2 = gapi.auth2.init({
                client_id: this.meetupService.googleSecretKey,
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            })
            gapi.auth2.getAuthInstance().signIn().then(googleUser => {
                let profile = googleUser.getBasicProfile();
                this.meetupService.isUserLoggedInWithGoogle = true;
                this.meetupService.googleSignUpChange.next(this.meetupService.isMobileNumberPopupForConsumer);
                this.meetupService.isMobileNumberPopupForConsumer = true;
                let userdata = {
                    'token': googleUser.getAuthResponse().id_token,
                    'name': profile.getName(),
                    'email': profile.getEmail()
                }

                this.meetupService.googleuserdata = JSON.stringify(userdata);



            }, (error) => {
                alert('something went wrong');
            })


        });
        return response;
    }

    logout() {

        gapi.load('auth2', () => {
            var auth2 = gapi.auth2.init({
                client_id: this.meetupService.googleSecretKey,
                cookiepolicy: 'single_host_origin',
                scope: 'profile email'
            })
            gapi.auth2.getAuthInstance().signOut().then(function () {
                this.meetupService.isUserLoggedInWithGoogle = false;

            });

        });
    }

}