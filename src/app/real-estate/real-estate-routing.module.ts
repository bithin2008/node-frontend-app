import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealEstateComponent } from './real-estate.component';
import { ThankYouComponent } from './thank-you/thank-you.component';

const routes: Routes = [
  {path:'',component:RealEstateComponent},
  {path:'thank-you',component:ThankYouComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RealEstateRoutingModule { }
