import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerPortalRoutingModule } from './customer-portal-routing.module';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../@shared/shared.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { BillingPaymentComponent } from './billing-payment/billing-payment.component';
import { MyCardComponent } from './my-card/my-card.component';
import { MyClaimComponent } from './my-claim/my-claim.component';
import { MyPolicyComponent } from './my-policy/my-policy.component';
import { ReferFriendComponent } from './refer-friend/refer-friend.component';
import { ReferFriendThankyouComponent } from './refer-friend/refer-friend-thankyou/refer-friend-thankyou.component';
import { FileClaimComponent } from './file-claim/file-claim.component';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CalendarModule } from 'primeng/calendar';
import { CreateClaimComponent } from './create-claim/create-claim.component';
import { CreatePolicyComponent } from './create-policy/create-policy.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "@env/environment";
@NgModule({
  declarations: [ CustomerDashboardComponent,EditProfileComponent,ChangePasswordComponent,BillingPaymentComponent,MyCardComponent,MyClaimComponent,MyPolicyComponent, ReferFriendComponent, ReferFriendThankyouComponent, FileClaimComponent, CreateClaimComponent, CreatePolicyComponent],
  imports: [
    CommonModule,
    CustomerPortalRoutingModule,  
    FormsModule,
    ReactiveFormsModule,
    SharedModule, 
    CalendarModule,
    NgStepperModule,
    CdkStepperModule,
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
})
export class CustomerPortalModule { }
