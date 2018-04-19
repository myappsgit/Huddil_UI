import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminBodyComponent } from './admin-body/admin-body.component';
import { AdminSideMenuComponent } from './admin-side-menu/admin-side-menu.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';

import { AdminDashboardComponent } from './admin-pages/admin-dashboard/admin-dashboard.component';
import { AdminPaymentsComponent } from './admin-pages/admin-payments/admin-payments.component';
import { AdminUsersComponent } from './admin-pages/admin-users/admin-users.component';
import { AdminFacilitiesComponent } from './admin-pages/admin-facilities/admin-facilities.component';
import { AdminTermsComponent } from './admin-pages/admin-terms/admin-terms.component';
import { AdminAmenitiesComponent } from './admin-pages/admin-amenities/admin-amenities.component';
import { AdminLocationsComponent } from './admin-pages/admin-locations/admin-locations.component';
import { AdminTaxComponent } from './admin-pages/admin-taxes/admin-taxes.component';

import { AdminUserStatusComponent } from './admin-pages/admin-components/admin-user-status-component/admin-user-status.component';
import { AdminFacilityStatusComponent } from './admin-pages/admin-components/admin-facitlity-status-component/admin-facility-status.component';
import { FacilityDetailsComponent } from './admin-pages/admin-facility-details/facility-details.component';
import { FacilityListingInfoComponent } from './admin-pages/admin-components/facility-info-component/facility-info.component';

import { AdminService } from '../admin-module/admin-providers/admin.services';

import { UserInfoComponent } from '../admin-module/admin-pages/admin-components/user-info-component/user-info.component';
import { RatingComponent } from '../admin-module/admin-pages/admin-components/rating-component/rating.component';
import { AdminPopupComponent } from '../admin-module/admin-pages/admin-components/admin-popup-component/admin-popup.component';

import { RouterModule } from '@angular/router';
import { adminRoutes } from './admin-routing.module';

import { AdminAuthGuard } from './admin-authGuard.service';

import { SharedModule } from '../../app/shared/shared.module';

import { AdminChangePasswordComponent } from './admin-pages/change-password/change-password.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminBodyComponent,
    AdminSideMenuComponent,
    AdminFooterComponent,
    AdminDashboardComponent,
    AdminPaymentsComponent,
    AdminUsersComponent,
    AdminFacilitiesComponent,
    AdminTermsComponent,
    AdminAmenitiesComponent,
    AdminLocationsComponent,
    AdminUserStatusComponent,
    AdminFacilityStatusComponent,
    FacilityDetailsComponent,
    FacilityListingInfoComponent,
    UserInfoComponent,
    RatingComponent,
    AdminTaxComponent,
    AdminPopupComponent,
    AdminChangePasswordComponent

  ],
  imports: [HttpModule, FormsModule, ReactiveFormsModule,
    CommonModule, RouterModule, adminRoutes, SharedModule
  ],
  providers: [AdminService, AdminAuthGuard],
  bootstrap: [AdminComponent]
})
export class AdminModule { }
