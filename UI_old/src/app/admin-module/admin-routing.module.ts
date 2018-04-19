import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AdminDashboardComponent } from './admin-pages/admin-dashboard/admin-dashboard.component';
import { AdminPaymentsComponent } from './admin-pages/admin-payments/admin-payments.component';
import { AdminUsersComponent } from './admin-pages/admin-users/admin-users.component';
import { AdminFacilitiesComponent } from './admin-pages/admin-facilities/admin-facilities.component';
import { AdminTermsComponent } from './admin-pages/admin-terms/admin-terms.component';
import { AdminAmenitiesComponent } from './admin-pages/admin-amenities/admin-amenities.component';
import { AdminLocationsComponent } from './admin-pages/admin-locations/admin-locations.component';
import { AdminTaxComponent } from './admin-pages/admin-taxes/admin-taxes.component';

import { FacilityDetailsComponent } from './admin-pages/admin-facility-details/facility-details.component';
import { AdminChangePasswordComponent } from './admin-pages/change-password/change-password.component';

import { AdminAuthGuard } from './admin-authGuard.service';
import { AdminComponent } from './admin.component';

export const adminRoutes = RouterModule.forChild([

    { path: '', component: AdminDashboardComponent, canActivate: [AdminAuthGuard] },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminAuthGuard] },
    { path: 'admin-payments', component: AdminPaymentsComponent, canActivate: [AdminAuthGuard] },
    { path: 'admin-users', component: AdminUsersComponent, canActivate: [AdminAuthGuard] },
    { path: 'admin-facilities', component: AdminFacilitiesComponent, canActivate: [AdminAuthGuard] },
    { path: 'admin-terms', component: AdminTermsComponent, canActivate: [AdminAuthGuard] },
    { path: 'admin-amenities', component: AdminAmenitiesComponent, canActivate: [AdminAuthGuard] },
    { path: 'admin-locations', component: AdminLocationsComponent, canActivate: [AdminAuthGuard] },
    { path: 'admin-taxes', component: AdminTaxComponent, canActivate: [AdminAuthGuard] },
    { path: 'facility-detail/:id', component: FacilityDetailsComponent, canActivate: [AdminAuthGuard] },
    { path: 'change-password', component: AdminChangePasswordComponent, canActivate: [AdminAuthGuard] }




]);
