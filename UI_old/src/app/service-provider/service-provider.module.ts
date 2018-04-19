import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';


import { ServiceProviderComponent } from './service-provider.component';
import { ServiceProviderHeaderComponent } from './header/header.component';
import { ServiceProviderFooterComponent } from './footer/footer.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';

import { BookingHistoryComponent } from './booking-history/booking-history.component';
import { BookingDetailComponent } from './booking-history/booking-detail/booking-detail.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { FacilityListingComponent } from './facility-listing/facility-listing.component';
import { SideBarComponent } from './sidebar/sidebar.component';
import { ServiceProviderRoutingModule } from './service-provider-routing.module';
import { FacilityListingInfoComponent } from './facility-listing/facility-listing-info/facility-listing-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentDashboardComponent } from './dashboard/payment-dashboard/payment-dashboard.component';
import { FacilityDashboardComponent } from './dashboard/facility-dashboard/facility-dashboard.component';
import { BookingDashboardComponent } from './dashboard/booking-dashboard/booking-dashboard.component';
import { BookingHistoryDashboardComponent } from './dashboard/booking-history-dashboard/booking-history.component';

import { AddFacilityComponent } from './add-facility/add-facility.component';
import { FacilityDetailComponent } from './facility-detail/facility-detail.component';
import { EditFacilityComponent } from './edit-facility/edit-facility.component';
import { ChartsModule } from 'ng2-charts';
import { UserChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component'
import { SPAuthGuard } from '../sp-authGuard.service';
import { FacilityBookingComponent } from './facility-booking-details/facility-booking-details.component';

@NgModule({
  declarations: [
    ServiceProviderComponent, ServiceProviderHeaderComponent, DashboardComponent, FacilityListingComponent, SideBarComponent,
    FacilityListingInfoComponent, PaymentDashboardComponent, BookingHistoryDashboardComponent, FacilityDashboardComponent,
    AddFacilityComponent, FacilityDetailComponent, ServiceProviderFooterComponent, EditFacilityComponent,
    BookingDashboardComponent, PaymentHistoryComponent, BookingHistoryComponent, BookingDetailComponent,
    UserChangePasswordComponent, EditProfileComponent, FacilityBookingComponent
  ],
  imports: [
    CommonModule, RouterModule, ServiceProviderRoutingModule, FormsModule, ReactiveFormsModule, ChartsModule, SharedModule
  ],
  providers: [SPAuthGuard],
  bootstrap: [DashboardComponent]
})
export class ServiceProviderModule { }
