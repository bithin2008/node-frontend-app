import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffiliatesComponent } from './affiliates.component';
import { AffiliatesThankYouComponent } from './affiliates-thank-you/affiliates-thank-you.component';

const routes: Routes = [
  {path:'',component:AffiliatesComponent},
  {path:'thank-you',component:AffiliatesThankYouComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffiliatesRoutingModule { }
