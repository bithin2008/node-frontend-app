import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerComponent } from './career.component';
import { CareerThankYouComponent } from './career-thank-you/career-thank-you.component';

const routes: Routes = [
  {path:'',component:CareerComponent},
  {path:'thank-you',component:CareerThankYouComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerRoutingModule { }
