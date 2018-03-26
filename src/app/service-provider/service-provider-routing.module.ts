import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FacilityListingComponent } from './facility-listing/facility-listing.component';
import { AddFacilityComponent } from './add-facility/add-facility.component';
import { FacilityDetailComponent } from './facility-detail/facility-detail.component';
import { EditFacilityComponent } from './edit-facility/edit-facility.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BookingDetailComponent } from './booking-history/booking-detail/booking-detail.component';
import { SPAuthGuard } from '../sp-authGuard.service';
import { UserChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FacilityBookingComponent } from './facility-booking-details/facility-booking-details.component';
const spRoutes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, canActivate:
    [SPAuthGuard]
  },
  {
    path: '', component: DashboardComponent, canActivate:
    [SPAuthGuard]
  },
  {
    path: 'facility-listing', component: FacilityListingComponent, canActivate:
    [SPAuthGuard]
  },
  {
    path: 'add-facility', component: AddFacilityComponent, canActivate:
    [SPAuthGuard]
  },
  {
    path: 'facility-detail/:id', component: FacilityDetailComponent, canActivate:
    [SPAuthGuard]
  }
  ,
  {
    path: 'edit-facility/:id', component: EditFacilityComponent, canActivate:
    [SPAuthGuard]
  },
  {
    path: 'payment-history', component: PaymentHistoryComponent, canActivate:
    [SPAuthGuard]
  }
  ,
  {
    path: 'booking-history', component: BookingHistoryComponent, canActivate:
    [SPAuthGuard]
  }
  ,
  {
    path: 'change-password', component: UserChangePasswordComponent, canActivate:
    [SPAuthGuard]
  },
  {
    path: 'booking-history/booking-detail/:id/:status', component: BookingDetailComponent, canActivate:
    [SPAuthGuard]
  },
  {
    path: 'edit-profile', component: EditProfileComponent, canActivate:
    [SPAuthGuard]
  },
  {
    path: 'booking-history/facility-booking/:id/:status', component: FacilityBookingComponent, canActivate:
    [SPAuthGuard]
  }

];
@NgModule({
  imports: [
    RouterModule.forChild(
      spRoutes
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class ServiceProviderRoutingModule { }
