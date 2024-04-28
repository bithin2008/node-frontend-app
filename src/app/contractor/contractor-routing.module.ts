import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractorComponent } from './contractor.component';
import { ContractorThankYouComponent } from './contractor-thank-you/contractor-thank-you.component';

const routes: Routes = [
  {path:'',component:ContractorComponent},
  {path:'thank-you',component:ContractorThankYouComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractorRoutingModule { }
