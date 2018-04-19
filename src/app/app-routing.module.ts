import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ConsumerComponent } from './consumer/consumer.component';
// import { ServiceProviderComponent } from './service-provider/service-provider.component';
import { ActivateEmailComponent } from './login/activate-email.component';
import { AuthGuard } from './auth-guard.service';
import { ConsumerAuthGuard } from './consumer-authGuard.service';
// import { AdvisorDashboardComponent } from './advisor/dashboard/advisor-dashboard.component';
// import { AdminComponent } from './admin-module/admin.component';
import { ServiceProviderSignUpComponent } from './partner-signup/partner-signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';

import { AboutUsComponent } from '../app/info-pages/about-us/about-us.component';
import { DisclaimerComponent } from '../app/info-pages/disclaimer/disclaimer.component';

import { PrivacyComponent } from '../app/info-pages/privacy/privacy.component';
import { NotFoundComponent } from '../app/info-pages/404-page/404-page.component';


const appRoutes: Routes = [
    // {
    //     path: 'login', component: LoginComponent
    // },
    {
        path: 'service-provider',
        loadChildren: './service-provider/service-provider.module#ServiceProviderModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'advisor',
        loadChildren: './advisor/advisor.module#AdvisorModule',
        canActivate: [AuthGuard]
    },
    {
        path: 'admin',
        loadChildren: './admin-module/admin.module#AdminModule',
        canActivate: [AuthGuard],

    },
    {
        path: 'activate-email', component: ActivateEmailComponent
    }
    ,
    {
        path: 'service-provider-signup', component: ServiceProviderSignUpComponent
    },
    {
        path: '', component: ConsumerComponent, canActivate:
            [ConsumerAuthGuard]
    },
    {
        path: 'forgot-password', component: ForgotPasswordComponent
    },
    {
        path: 'reset-password', component: ResetPasswordComponent
    },
    {
        path: 'about-us', component: AboutUsComponent
    },
    {
        path: 'disclaimer', component: DisclaimerComponent
    },
    {
        path: 'privacy', component: PrivacyComponent
    },
    {
        path: 'usage-policy', component: PrivacyComponent
    },
    {
        path: 'not-found', component: NotFoundComponent
    },
    {
        path: '**', component: NotFoundComponent
    }
];
@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [

    ]
})
export class AppRoutingModule { }
