import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../@shared/shared.module';
import { CountdownModule } from 'ngx-countdown';
import { NgOtpInputModule } from 'ng-otp-input';
import { CustomerComponent } from './customer.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ValidateOtpComponent } from './validate-otp/validate-otp.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [CustomerLoginComponent, ValidateOtpComponent, CustomerComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgOtpInputModule,
    CountdownModule,
  ]
})
export class CustomerModule { }
