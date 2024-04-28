import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { CareerRoutingModule } from './career-routing.module';
import { CareerComponent } from './career.component';
import { SharedModule } from '../@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CareerThankYouComponent } from './career-thank-you/career-thank-you.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "@env/environment";

@NgModule({
  declarations: [
    CareerComponent,
    CareerThankYouComponent
  ],
  imports: [
    CommonModule,
    CareerRoutingModule,
    PaginatorModule,
    ReactiveFormsModule,
    SharedModule,
    RecaptchaV3Module
  ] ,
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
})
export class CareerModule { }
