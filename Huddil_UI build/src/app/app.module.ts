import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

//login
import { LoginComponent } from './login/login.component';
import { LoginHeaderComponent } from './login/header/header.component';
import { LoginFooterComponent } from './login/footer/footer.component';
import { ActivateEmailComponent } from './login/activate-email.component';


import { AppRoutingModule } from './app-routing.module';


import { FacebookService } from './social-authentication/facebook.service';
import { GoogleService } from './social-authentication/google.service';

//form modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//service
import { MeetupService } from './provider/meetup.service';

//modules
import { ConsumerModule } from './consumer/consumer.module';
// import { ServiceProviderModule } from './service-provider/service-provider.module';
// import { AdvisorModule } from './advisor/advisor.module';
// import { AdminModule } from './admin-module/admin.module'

import { AuthGuard } from './auth-guard.service';
import { ConsumerAuthGuard } from './consumer-authGuard.service';


import { UtilityService } from './utility.servivce';

import { UserSignUpComponent } from './sign-up/sign-up.component';
import { ServiceProviderSignUpComponent } from './partner-signup/partner-signup.component';
import { ServiceProviderSignupHeaderComponent } from './partner-signup/header/header.component';
import { ServiceProviderSignupFooterComponent } from './partner-signup/footer/footer.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';

import { SharedModule } from './shared/shared.module';

import { AboutUsComponent } from '../app/info-pages/about-us/about-us.component';
import { DisclaimerComponent } from '../app/info-pages/disclaimer/disclaimer.component';

import { PrivacyComponent } from '../app/info-pages/privacy/privacy.component';
import { NotFoundComponent } from '../app/info-pages/404-page/404-page.component';
import { AdminService } from './admin-module/admin-providers/admin.services';




@NgModule({
  declarations: [
    AppComponent, LoginComponent, LoginHeaderComponent, LoginFooterComponent, ActivateEmailComponent,
    UserSignUpComponent, ServiceProviderSignUpComponent, ServiceProviderSignupHeaderComponent,
    ServiceProviderSignupFooterComponent, ForgotPasswordComponent, ResetPasswordComponent,
    AboutUsComponent, DisclaimerComponent, PrivacyComponent, NotFoundComponent
  ],
  imports: [
    BrowserModule, ConsumerModule, FormsModule, ReactiveFormsModule, HttpModule, AppRoutingModule, SharedModule
  ],
  providers: [MeetupService, AdminService, FacebookService, GoogleService, AuthGuard, ConsumerAuthGuard, UtilityService],
  bootstrap: [AppComponent]
})
export class AppModule { }
