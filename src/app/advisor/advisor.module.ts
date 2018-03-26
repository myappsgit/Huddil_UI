import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';


import { AdvisorDashboardComponent } from './dashboard/advisor-dashboard.component';
import { AdvisorRoutingModule } from './advisor-routing.module';
import { AdvisorSideBarComponent } from './sidebar/sidebar.component';
import { AdvisorHeaderComponent } from './header/header.component';
import { AdvisorFooterComponent } from './footer/footer.component';
import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BlockUnblockServiceProviderComponent } from './service-providers-list/service-providers-details/service-providers-details.component';
import { BookingDetailComponent } from './booking-history/booking-detail/booking-detail.component';
import { FacilityListingComponent } from './facility-listing/facility-listing.component';
import { FacilityListingInfoComponent } from './facility-listing/facility-listing-info/facility-listing-info.component';
import { FacilityDetailsComponent } from './facility-detail/facility-detail.component';


import { SharedModule } from '../shared/shared.module';
import { ServiceProvidersListomponent } from './service-providers-list/service-providers-list.component';

import { AdvisorChangePasswordComponent } from './change-password/change-password.component';
import { AdvisorAuthGuard } from '../advisor-authGuard.service';
import { FacilityBookingComponent } from './facility-booking-details/facility-booking-details.component';

@NgModule({
  declarations: [
    AdvisorDashboardComponent, AdvisorSideBarComponent, AdvisorHeaderComponent, AdvisorFooterComponent,
    FacilityListingComponent, FacilityListingInfoComponent, BookingHistoryComponent, ServiceProvidersListomponent,
    FacilityDetailsComponent, BlockUnblockServiceProviderComponent, BookingDetailComponent,
    AdvisorChangePasswordComponent, FacilityBookingComponent
  ],
  imports: [
    CommonModule, RouterModule, AdvisorRoutingModule, FormsModule, ReactiveFormsModule, ChartsModule, SharedModule
  ],
  providers: [AdvisorAuthGuard],
  bootstrap: [AdvisorDashboardComponent]
})
export class AdvisorModule { }
