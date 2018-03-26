import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanLoad, Route
} from '@angular/router';
import { AdminService } from './admin-providers/admin.services';




@Injectable()
export class AdminAuthGuard implements CanActivate, CanLoad {
  status: boolean;
  constructor(private adminService: AdminService, private router: Router) {

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
    if (sessionStorage.getItem('currentUser')) {
      this.adminService.isLoggedIn = true;
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.adminService.adminSessionId = currentUser.sessionId;
      if (currentUser.userType == '8' || currentUser.userType == '6' || currentUser.userType == '7') {
        this.router.navigate([currentUser.redirectUrl]);
      }

      return true;
    }
    else if (localStorage.getItem('authCookie')) {
      this.adminService.isLoggedIn = true;
      var currentUser = JSON.parse(localStorage.getItem('authCookie'));
      this.adminService.adminSessionId = currentUser.sessionId;
      if (currentUser.userType == '8' || currentUser.userType == '6' || currentUser.userType == '6' || currentUser.userType == '7') {
        this.router.navigate([currentUser.redirectUrl]);
      }

      return true;
    }


    else {
      this.router.navigate(['']);
      return true;

    }
  }
}