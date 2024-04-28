import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractorRoutingModule } from './contractor-routing.module';
import { ContractorComponent } from './contractor.component';
import { SharedModule } from '../@shared/shared.module';
import { StarRatingModule } from 'angular-star-rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ContractorThankYouComponent } from './contractor-thank-you/contractor-thank-you.component';
import { PrimeNgModule } from '../prime-ng.module';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "@env/environment";
@NgModule({
  declarations: [
    ContractorComponent,
    ContractorThankYouComponent
  ],
  imports: [
    CommonModule,
    ContractorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PrimeNgModule,
    StarRatingModule.forRoot(),
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
export class ContractorModule { }
