import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AffiliatesRoutingModule } from './affiliates-routing.module';
import { AffiliatesComponent } from './affiliates.component';
import { SharedModule } from '../@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AffiliatesThankYouComponent } from './affiliates-thank-you/affiliates-thank-you.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "@env/environment";

@NgModule({
  declarations: [
    AffiliatesComponent,
    AffiliatesThankYouComponent
  ],
  imports: [
    CommonModule,
    AffiliatesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    AffiliatesRoutingModule,
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
})
export class AffiliatesModule { }
