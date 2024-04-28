import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { LandingStepTwoComponent } from './landing-step-two/landing-step-two.component';
import { LandingStepOneComponent } from './landing-step-one/landing-step-one.component';
import { LandingStepThreeComponent } from './landing-step-three/landing-step-three.component';
import { LandingThankyouComponent } from './landing-thankyou/landing-thankyou.component';

const routes: Routes = [
  {
   path: '', component: LandingStepOneComponent
  },
  {
    path: 'step-two', component: LandingStepTwoComponent
   },
   {
    path: 'step-three', component: LandingStepThreeComponent
   },
   {
    path: 'thank-you', component: LandingThankyouComponent
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
