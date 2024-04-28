import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyStepperRoutingModule } from './policy-stepper-routing.module';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "@env/environment";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RecaptchaV3Module,
    PolicyStepperRoutingModule
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
})
export class PolicyStepperModule { }
