import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConsumerComponent } from './consumer.component';
import { LandingScreenComponent } from './landing-screen/landing-screen.component';
import { ConsumerHeaderComponent } from './header/header.component';
import { LatestNewsComponent } from './latest-news/latest-news.component';
import { TestimonialComponent } from './testimonials/testimonials.component';
import { FooterComponent } from './footer/footer.component';
import { EventsComponent } from './events/events.component';
//facility listing
import { FacilityListingComponent } from './facility-listing/facility-listing.component';
import { FacilityListingInfoComponent } from './facility-listing/facility-listing-info/facility-listing-info.component';
import { FacilityDetailPageComponent } from './facility-detail/facility-detail.component';

import { MeetupService } from '../provider/meetup.service'; //service
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown'; //multiselect

import { FavoriteFacilitiesComponent } from './favourite-facilities/favourite-facilities.component';
import { FavouriteFacilitiesInfoComponent } from './favourite-facilities/favourite-facilities-info/favourite-facilities-info.component';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
//shared module
import { SharedModule } from '../shared/shared.module';

import { ConsumerRoutingModule } from './consumer-routing.module';


import { BookingProcessComponent } from './booking-process/booking-process.component';

import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { BookingDetailComponent } from './my-bookings/booking-detail/booking-detail.component';
import { AttendessListComponent } from './attendees-list/attendees-list.component';

import { AddTeamComponent } from './attendees-list/add-team/add-team.component';
import { EditTeamComponent } from './attendees-list/edit-team/edit-team.component';

import { ConsumerChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
@NgModule({
  declarations: [
    ConsumerComponent, LandingScreenComponent, ConsumerHeaderComponent, LatestNewsComponent, TestimonialComponent,
    FooterComponent, EventsComponent, FacilityListingComponent, FacilityListingInfoComponent, FavoriteFacilitiesComponent,
    FavouriteFacilitiesInfoComponent, FacilityDetailPageComponent, BookingSummaryComponent,
    OrderConfirmationComponent, BookingProcessComponent, MyBookingsComponent, BookingDetailComponent,
    AttendessListComponent, AddTeamComponent, EditTeamComponent, ConsumerChangePasswordComponent, EditProfileComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule, AngularMultiSelectModule, SharedModule, ConsumerRoutingModule
  ],
  exports: [FooterComponent, ConsumerHeaderComponent],
  providers: [MeetupService],
  bootstrap: [ConsumerComponent]
})
export class ConsumerModule { }
