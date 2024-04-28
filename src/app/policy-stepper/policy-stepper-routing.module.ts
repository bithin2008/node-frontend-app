import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyStepperComponent } from './policy-stepper.component';


const routes: Routes = [
  {path:'',component:PolicyStepperComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyStepperRoutingModule { }
