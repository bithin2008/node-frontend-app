import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealtorRoutingModule } from './realtor-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../@shared/shared.module';
import { CountdownModule } from 'ngx-countdown';
import { NgOtpInputModule } from 'ng-otp-input';
import { RealtorComponent } from './realtor.component';
import { RealtorLoginComponent } from './realtor-pre-login/realtor-login/realtor-login.component';
import { ValidateOtpComponent } from './realtor-pre-login/validate-otp/validate-otp.component';
import { ForgotPasswordComponent } from './realtor-pre-login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './realtor-pre-login/reset-password/reset-password.component';

import { RealtorPreHeaderComponent } from './realtor-pre-login/realtor-pre-header/realtor-pre-header.component';
import { RealtorPostHeaderComponent } from './realtor-post-login/realtor-post-header/realtor-post-header.component';
import { RealtorPreFooterComponent } from './realtor-pre-login/realtor-pre-footer/realtor-pre-footer.component';
import { RealtorPostFooterComponent } from './realtor-post-login/realtor-post-footer/realtor-post-footer.component';
import { RealtorThankyouComponent } from './realtor-post-login/realtor-thankyou/realtor-thankyou.component';
import { FaqComponent } from './realtor-post-login/faq/faq.component';
import { EditProfileComponent } from './realtor-post-login/edit-profile/edit-profile.component';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CreatePolicyComponent } from './realtor-post-login/create-policy/create-policy.component';
import { DashboardComponent } from './realtor-post-login/dashboard/dashboard.component';
import { PrimeNgModule } from '../prime-ng.module';
import { ChangePasswordComponent } from './realtor-post-login/change-password/change-password.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "@env/environment";


@NgModule({
  declarations: [RealtorLoginComponent,CreatePolicyComponent, ValidateOtpComponent, RealtorComponent, ForgotPasswordComponent, ResetPasswordComponent, RealtorPreHeaderComponent, RealtorPostHeaderComponent, RealtorPreFooterComponent,RealtorPostFooterComponent, DashboardComponent, RealtorThankyouComponent, EditProfileComponent, FaqComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    RealtorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgOtpInputModule,
    CountdownModule,
    NgStepperModule,
    CdkStepperModule,
    PrimeNgModule,    
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
})
export class RealtorModule { }
