import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { ConsumerAuthGuard } from '../consumer-authGuard.service';

import { FacilityListingComponent } from './facility-listing/facility-listing.component';
import { FavoriteFacilitiesComponent } from './favourite-facilities/favourite-facilities.component';
import { FacilityDetailPageComponent } from './facility-detail/facility-detail.component';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { BookingDetailComponent } from './my-bookings/booking-detail/booking-detail.component';
import { AttendessListComponent } from './attendees-list/attendees-list.component';

import { AddTeamComponent } from './attendees-list/add-team/add-team.component';
import { EditTeamComponent } from './attendees-list/edit-team/edit-team.component';
import { BookingProcessComponent } from './booking-process/booking-process.component';
import { ConsumerChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


const consumerRoutes: Routes = [

  {
    path: 'consumer/facility-listing/:cityId/:localityId/:facilityType', component: FacilityListingComponent, canActivate:
    [ConsumerAuthGuard]
  }
  ,

  {
    path: 'consumer/favourite-listing', component: FavoriteFacilitiesComponent, canActivate:
    [ConsumerAuthGuard]
  },
  {
    path: 'consumer/facility-detail/:id', component: FacilityDetailPageComponent, canActivate:
    [ConsumerAuthGuard]
  }
  ,
  {
    path: 'consumer/booking-summary', component: BookingSummaryComponent, canActivate:
    [ConsumerAuthGuard]
  }
  ,
  {
    path: 'consumer/order-confirmation/:id', component: OrderConfirmationComponent, canActivate:
    [ConsumerAuthGuard]
  }
  ,
  {
    path: 'consumer/my-bookings', component: MyBookingsComponent, canActivate:
    [ConsumerAuthGuard]
  },
  {
    path: 'consumer/my-bookings/booking-detail/:type', component: BookingDetailComponent, canActivate:
    [ConsumerAuthGuard]
  }
  ,
  {
    path: 'consumer/attendees-list', component: AttendessListComponent, canActivate:
    [ConsumerAuthGuard]
  },
  {
    path: 'consumer/add-team', component: AddTeamComponent, canActivate:
    [ConsumerAuthGuard]
  },
  {
    path: 'consumer/edit-team/:id/:name', component: EditTeamComponent, canActivate:
    [ConsumerAuthGuard]
  },
  {
    path: 'consumer/booking-process', component: BookingProcessComponent, canActivate:
    [ConsumerAuthGuard]
  }
  ,
  {
    path: 'consumer/change-password', component: ConsumerChangePasswordComponent, canActivate:
    [ConsumerAuthGuard]
  }
  ,
  {
    path: 'consumer/edit-profile', component: EditProfileComponent, canActivate:
    [ConsumerAuthGuard]
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(
      consumerRoutes
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})
export class ConsumerRoutingModule { }
