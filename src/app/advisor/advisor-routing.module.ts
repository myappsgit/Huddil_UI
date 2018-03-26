import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AdvisorDashboardComponent } from './dashboard/advisor-dashboard.component';
import { AdvisorAuthGuard } from '../advisor-authGuard.service';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BlockUnblockServiceProviderComponent } from './service-providers-list/service-providers-details/service-providers-details.component';
import { FacilityDetailsComponent } from './facility-detail/facility-detail.component';
import { FacilityListingComponent } from './facility-listing/facility-listing.component';
import { ServiceProvidersListomponent } from './service-providers-list/service-providers-list.component';
import { FacilityBookingComponent } from './facility-booking-details/facility-booking-details.component';

import { AdvisorChangePasswordComponent } from './change-password/change-password.component';
const spRoutes: Routes = [
  {
    path: '', component: AdvisorDashboardComponent, canActivate:
      [AdvisorAuthGuard]
  },
  {
    path: 'dashboard', component: AdvisorDashboardComponent, canActivate:
      [AdvisorAuthGuard]
  },
  {
    path: 'facility-listing', component: FacilityListingComponent, canActivate:
      [AdvisorAuthGuard]
  },
  {
    path: 'booking-history', component: BookingHistoryComponent, canActivate:
      [AdvisorAuthGuard]
  },
  {
    path: 'service-providers-list', component: ServiceProvidersListomponent, canActivate:
      [AdvisorAuthGuard]
  },
  {
    path: 'change-password', component: AdvisorChangePasswordComponent, canActivate:
      [AdvisorAuthGuard]
  },
  {
    path: 'facility-listing/facility-detail/:id', component: FacilityDetailsComponent, canActivate:
      [AdvisorAuthGuard]
  },
  {
    path: 'service-providers-list/service-providers-details', component: BlockUnblockServiceProviderComponent, canActivate:
      [AdvisorAuthGuard]
  },
  {
    path: 'booking-history/facility-booking/:id/:status', component: FacilityBookingComponent, canActivate:
      [AdvisorAuthGuard]
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
export class AdvisorRoutingModule { }
