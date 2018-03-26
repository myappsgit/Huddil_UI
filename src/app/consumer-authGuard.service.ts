import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanLoad, Route
} from '@angular/router';
import { MeetupService } from './provider/meetup.service';



@Injectable()
export class ConsumerAuthGuard implements CanActivate, CanLoad {
  status: boolean;
  currentUrl: any;
  currentPath = '';
  constructor(private meetupService: MeetupService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    this.currentUrl = state.url;
    if (route.url[1] != undefined) {
      this.currentPath = route.url[1].path;
    }

    return this.checkLogin(url);
  }
  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (sessionStorage.getItem('consumerName')) {
      this.meetupService.consumerUserData = sessionStorage.getItem('consumerName');
      // alert(this.meetupService.consumerUserData);
    }
    if (sessionStorage.getItem('currentUser')) {
      if (sessionStorage.getItem('isLatestTCPS') == 'true') {
        this.meetupService.getTermsAndConditionsForConsumer();
        this.meetupService.isShowTCPSLoginPopUp = true;
      }
      this.meetupService.isLoggedIn = true;
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.meetupService.sessionId = currentUser.sessionId;
      this.meetupService.consumerUserData = currentUser.diaplayName;
      if (currentUser.userType == '7' || currentUser.userType == '6' || currentUser.userType == '5') {
        this.router.navigate([currentUser.redirectUrl]);
      }

      return true;
    }
    else if (localStorage.getItem('authCookie')) {
      if (sessionStorage.getItem('isLatestTCPS')) {
        this.meetupService.getTermsAndConditionsForSP();
        this.meetupService.isShowTCPSLoginPopUp = true;
      }
      this.meetupService.isLoggedIn = true;
      var currentUser = JSON.parse(localStorage.getItem('authCookie'));
      this.meetupService.sessionId = currentUser.sessionId;
      this.meetupService.consumerUserData = currentUser.diaplayName;
      if (currentUser.userType == '7' || currentUser.userType == '6' || currentUser.userType == '5') {
        this.router.navigate([currentUser.redirectUrl]);
      }

      return true;
    }


    else {

      if (this.currentUrl == '/' || this.currentPath == 'facility-listing' || this.currentPath == 'facility-detail') {
        return true;
      }
      else {
        this.router.navigate(['']);
        return true;
      }

    }
  }
}