import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FPHWFaqComponent } from './fphw-faq.component';

const routes: Routes = [
  {path:'',component:FPHWFaqComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FPHWFaqRoutingModule { }
