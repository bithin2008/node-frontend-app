import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { SharedModule } from '../@shared/shared.module';
import { StarRatingModule } from 'angular-star-rating';
import { LandingStepTwoComponent } from './landing-step-two/landing-step-two.component';
import { LandingStepOneComponent } from './landing-step-one/landing-step-one.component';
import { LandingStepThreeComponent } from './landing-step-three/landing-step-three.component';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingThankyouComponent } from './landing-thankyou/landing-thankyou.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from "@env/environment";
@NgModule({
  declarations: [
    LandingComponent,
    LandingStepTwoComponent,
    LandingStepOneComponent,
    LandingStepThreeComponent,
    LandingThankyouComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StarRatingModule.forRoot(),
    NgStepperModule,
    CdkStepperModule,
    RecaptchaV3Module,
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey,
    },
  ],
})
export class LandingModule {
  // nextStep(step:any){
  //   let prevStep = `step${step-1}`
  //   let currentStep = `step${step}`
  //   let stepEl= document.getElementById(currentStep);
  //   let prevStepEl= document.getElementById(prevStep);
    
  //  // console.log(stepEl);
  //   let formStyle:any = document.getElementsByClassName('form-style-3')
  //   if (formStyle && formStyle.length>0) {
  //     let formArray = Array.from(formStyle);

  //     formArray.forEach((element:any) => {
  //       console.log(element);

  //       element.classList.remove('active')
  //     });
  //   }
  //   if (prevStepEl) {
  //     prevStepEl.classList.add("complete");
  //   }
  //   if (stepEl) {
  //     stepEl.classList.add("active");
  //     let getP =  stepEl.parentElement as HTMLElement;
  //     getP.style.height = `${stepEl.offsetHeight}px`;
  //   }
  

  //  }

  
 }
