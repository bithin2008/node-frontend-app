import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RealEstateRoutingModule } from './real-estate-routing.module';
import { RealEstateComponent } from './real-estate.component';
import { SharedModule } from '../@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { StarRatingModule } from 'angular-star-rating';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "@env/environment";
@NgModule({
  declarations: [
    RealEstateComponent,
    ThankYouComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RealEstateRoutingModule,
    ReactiveFormsModule,
    StarRatingModule.forRoot(),
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
})
export class RealEstateModule { }
