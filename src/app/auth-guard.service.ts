import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanLoad, Route
} from '@angular/router';
import { MeetupService } from './provider/meetup.service';
import 'rxjs/add/operator/bufferCount';



@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  status: boolean;
  previousUrl: any;
  constructor(private meetupService: MeetupService, private router: Router) {
    //alert('auth--' + sessionStorage.getItem('isLatestTCPS'));
    // if (sessionStorage.getItem('isLatestTCPS')) {
    //   var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    //   if (currentUser.userType == '7' || currentUser.userType == '8') {
    //     this.meetupService.getTermsAndConditionsForSP();
    //     this.meetupService.isShowTCPSLoginPopUp = true;
    //   }
    // }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;



    return this.checkLogin(url);

  }
  canLoad(route: Route): boolean {

    let url = `/${route.path}`;

    return this.checkLogin(url);

  }

  checkLogin(url: string): boolean {
    this.meetupService.isLoginPopUp = false;

    if (sessionStorage.getItem('currentUser')) {

      this.meetupService.isLoggedIn = true;
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.meetupService.sessionId = currentUser.SessionId;

      return true;
    }

    else if (localStorage.getItem('authCookie')) {

      this.meetupService.isLoggedIn = true;
      var currentUser = JSON.parse(localStorage.getItem('authCookie'));
      this.meetupService.sessionId = currentUser.sessionId;


      return true;
    }


    else {

      this.router.navigate(['']);
      return false;

    }
  }
}