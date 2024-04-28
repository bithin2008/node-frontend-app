import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OurCoverageComponent } from './our-coverage.component';


const routes: Routes = [
  {path:'',component:OurCoverageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OurCoverageRoutingModule { }
